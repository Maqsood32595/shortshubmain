import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const platformTokens = pgTable("platform_tokens", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  platform: varchar("platform").notNull(), // 'tiktok', 'instagram', 'youtube'
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  platformUserId: varchar("platform_user_id"),
  platformUsername: varchar("platform_username"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  sourceUrl: text("source_url"), // GCS URL
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // seconds
  status: varchar("status").notNull().default("processing"), // 'processing', 'ready', 'failed'
  variants: jsonb("variants"), // platform-specific variants
  metadata: jsonb("metadata"), // AI generation metadata, upload info, etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const scheduledPosts = pgTable("scheduled_posts", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  videoId: varchar("video_id").notNull(),
  platforms: jsonb("platforms").notNull(), // array of platform configs
  scheduleAt: timestamp("schedule_at").notNull(),
  status: varchar("status").notNull().default("pending"), // 'pending', 'posted', 'failed'
  postResults: jsonb("post_results"), // platform-specific post IDs and results
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiJobs = pgTable("ai_jobs", {
  id: varchar("id").primaryKey().notNull(),
  userId: varchar("user_id").notNull(),
  prompt: text("prompt").notNull(),
  style: varchar("style").default("cinematic"),
  duration: integer("duration").default(30),
  status: varchar("status").notNull().default("pending"), // 'pending', 'processing', 'completed', 'failed'
  progress: integer("progress").default(0),
  resultUrl: text("result_url"),
  errorMessage: text("error_message"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  platformTokens: many(platformTokens),
  videos: many(videos),
  scheduledPosts: many(scheduledPosts),
  aiJobs: many(aiJobs),
}));

export const platformTokensRelations = relations(platformTokens, ({ one }) => ({
  user: one(users, {
    fields: [platformTokens.userId],
    references: [users.id],
  }),
}));

export const videosRelations = relations(videos, ({ one, many }) => ({
  user: one(users, {
    fields: [videos.userId],
    references: [users.id],
  }),
  scheduledPosts: many(scheduledPosts),
}));

export const scheduledPostsRelations = relations(scheduledPosts, ({ one }) => ({
  user: one(users, {
    fields: [scheduledPosts.userId],
    references: [users.id],
  }),
  video: one(videos, {
    fields: [scheduledPosts.videoId],
    references: [videos.id],
  }),
}));

export const aiJobsRelations = relations(aiJobs, ({ one }) => ({
  user: one(users, {
    fields: [aiJobs.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertPlatformTokenSchema = createInsertSchema(platformTokens).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertScheduledPostSchema = createInsertSchema(scheduledPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiJobSchema = createInsertSchema(aiJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = z.infer<typeof insertUserSchema> & { id: string };
export type User = typeof users.$inferSelect;
export type PlatformToken = typeof platformTokens.$inferSelect;
export type InsertPlatformToken = z.infer<typeof insertPlatformTokenSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = z.infer<typeof insertScheduledPostSchema>;
export type AiJob = typeof aiJobs.$inferSelect;
export type InsertAiJob = z.infer<typeof insertAiJobSchema>;
