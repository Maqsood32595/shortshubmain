import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  for (const domain of process.env
    .REPLIT_DOMAINS!.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const user = req.user as any;

  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
import { Request, Response, NextFunction } from "express";
import { Issuer, Strategy as OpenIDStrategy } from "openid-client";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { storage } from "./storage";
import { db } from "./db";

const PgSession = connectPgSimple(session);

export async function setupAuth(app: any) {
  // Session configuration
  app.use(
    session({
      store: new PgSession({
        pool: db as any, // Type assertion for compatibility
        tableName: "sessions",
        createTableIfMissing: false,
      }),
      secret: process.env.SESSION_SECRET || "fallback-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      },
    })
  );

  // Passport configuration
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure OpenID Connect strategy
  try {
    const issuerUrl = process.env.ISSUER_URL || "https://replit.com";
    const issuer = await Issuer.discover(issuerUrl);
    
    const client = new issuer.Client({
      client_id: "replit",
      client_secret: process.env.CLIENT_SECRET,
      redirect_uris: [getRedirectUri()],
      response_types: ["code"],
    });

    passport.use(
      "oidc",
      new OpenIDStrategy(
        {
          client,
          params: {
            scope: "openid profile email",
          },
        },
        async (tokenSet: any, userinfo: any, done: any) => {
          try {
            const user = await storage.upsertUser({
              id: userinfo.sub,
              email: userinfo.email,
              firstName: userinfo.given_name,
              lastName: userinfo.family_name,
              profileImageUrl: userinfo.picture,
            });
            return done(null, { user, claims: userinfo });
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  } catch (error) {
    console.error("Failed to setup OpenID Connect:", error);
    // Fallback for development
    passport.use(
      "mock",
      new (class MockStrategy {
        authenticate() {
          const mockUser = {
            user: {
              id: "mock-user-id",
              email: "test@example.com",
              firstName: "Test",
              lastName: "User",
            },
            claims: {
              sub: "mock-user-id",
              email: "test@example.com",
              given_name: "Test",
              family_name: "User",
            },
          };
          (this as any).success(mockUser);
        }
      })()
    );
  }

  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });

  // Auth routes
  app.get("/api/login", (req: Request, res: Response, next: NextFunction) => {
    const strategy = process.env.NODE_ENV === "development" ? "mock" : "oidc";
    passport.authenticate(strategy)(req, res, next);
  });

  app.get(
    "/api/auth/callback",
    passport.authenticate("oidc", {
      successRedirect: "/",
      failureRedirect: "/login",
    })
  );

  app.post("/api/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

function getRedirectUri() {
  const domains = process.env.REPLIT_DOMAINS;
  if (domains) {
    const primaryDomain = domains.split(",")[0];
    return `https://${primaryDomain}/api/auth/callback`;
  }
  return "http://localhost:5000/api/auth/callback";
}
