import { defineConfig } from "drizzle-kit";

// It's good practice to ensure environment variables are loaded for drizzle-kit
// If your .env file is in the root, and you're running drizzle-kit from there,
// you might need a dotenv import if not handled by your script runner.
// import dotenv from "dotenv";
// dotenv.config({ path: ".env" }); // Adjust path if your .env is elsewhere

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Please ensure the database is provisioned and the environment variable is configured for Drizzle Kit.",
  );
}

export default defineConfig({
  schema: "./shared/schema.ts", // <-- Your schema file path
  out: "./drizzle", // <-- Directory where migration files will be generated
  dialect: "postgresql", // <-- Specify PostgreSQL dialect
  dbCredentials: {
    url: process.env.DATABASE_URL, // <-- Using 'url' for connection string
  },
  // If you are using a Replit database, you might need to enable `ssl`
  // if your connection string doesn't implicitly handle it.
  // This is generally handled by the connection string itself for Google Cloud SQL.
  // If issues persist, consider adding: ssl: true as part of dbCredentials
});
