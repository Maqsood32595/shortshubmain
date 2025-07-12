import {
  users,
  videos,
  scheduledPosts,
  platformTokens,
  aiJobs,
  type User,
  type UpsertUser,
  type Video,
  type InsertVideo,
  type ScheduledPost,
  type InsertScheduledPost,
  type PlatformToken,
  type InsertPlatformToken,
  type AiJob,
  type InsertAiJob,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lt } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Video operations
  getVideos(
    userId: string,
    cursor?: string,
    limit?: number,
  ): Promise<{ videos: Video[]; nextCursor?: string }>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, updates: Partial<Video>): Promise<Video>;
  getVideo(id: string): Promise<Video | undefined>;

  // AI Job operations
  createAiJob(job: InsertAiJob): Promise<AiJob>;
  updateAiJob(id: string, updates: Partial<AiJob>): Promise<AiJob>;
  getAiJob(id: string): Promise<AiJob | undefined>;
  getUserAiJobs(userId: string): Promise<AiJob[]>;

  // Scheduled Post operations
  createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost>;
  updateScheduledPost(
    id: string,
    updates: Partial<ScheduledPost>,
  ): Promise<ScheduledPost>;
  getUserScheduledPosts(userId: string): Promise<ScheduledPost[]>;
  getPendingScheduledPosts(): Promise<ScheduledPost[]>;

  // Platform Token operations
  upsertPlatformToken(token: InsertPlatformToken): Promise<PlatformToken>;
  getUserPlatformTokens(userId: string): Promise<PlatformToken[]>;
  getPlatformToken(
    userId: string,
    platform: string,
  ): Promise<PlatformToken | undefined>;
  deletePlatformToken(userId: string, platform: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Video operations
  async getVideos(
    userId: string,
    cursor?: string,
    limit = 20,
  ): Promise<{ videos: Video[]; nextCursor?: string }> {
    const whereClause = cursor
      ? and(eq(videos.userId, userId), lt(videos.createdAt, new Date(cursor)))
      : eq(videos.userId, userId);

    const results = await db
      .select()
      .from(videos)
      .where(whereClause)
      .orderBy(desc(videos.createdAt))
      .limit(limit + 1);

    const hasMore = results.length > limit;
    const videoList = hasMore ? results.slice(0, -1) : results;
    const nextCursor = hasMore
      ? videoList[videoList.length - 1]?.createdAt?.toISOString()
      : undefined;

    return { videos: videoList, nextCursor };
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values({ id: crypto.randomUUID(), ...video })
      .returning();
    return newVideo;
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video> {
    const [updatedVideo] = await db
      .update(videos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  // AI Job operations
  async createAiJob(job: InsertAiJob): Promise<AiJob> {
    const [newJob] = await db
      .insert(aiJobs)
      .values({ id: crypto.randomUUID(), ...job })
      .returning();
    return newJob;
  }

  async updateAiJob(id: string, updates: Partial<AiJob>): Promise<AiJob> {
    const [updatedJob] = await db
      .update(aiJobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(aiJobs.id, id))
      .returning();
    return updatedJob;
  }

  async getAiJob(id: string): Promise<AiJob | undefined> {
    const [job] = await db.select().from(aiJobs).where(eq(aiJobs.id, id));
    return job;
  }

  async getUserAiJobs(userId: string): Promise<AiJob[]> {
    return await db
      .select()
      .from(aiJobs)
      .where(eq(aiJobs.userId, userId))
      .orderBy(desc(aiJobs.createdAt));
  }

  // Scheduled Post operations
  async createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost> {
    const [newPost] = await db
      .insert(scheduledPosts)
      .values({ id: crypto.randomUUID(), ...post })
      .returning();
    return newPost;
  }

  async updateScheduledPost(
    id: string,
    updates: Partial<ScheduledPost>,
  ): Promise<ScheduledPost> {
    const [updatedPost] = await db
      .update(scheduledPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(scheduledPosts.id, id))
      .returning();
    return updatedPost;
  }

  async getUserScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    return await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.userId, userId))
      .orderBy(desc(scheduledPosts.scheduleAt));
  }

  async getPendingScheduledPosts(): Promise<ScheduledPost[]> {
    return await db
      .select()
      .from(scheduledPosts)
      .where(
        and(
          eq(scheduledPosts.status, "pending"),
          lt(scheduledPosts.scheduleAt, new Date()),
        ),
      );
  }

  // Platform Token operations
  async upsertPlatformToken(
    token: InsertPlatformToken,
  ): Promise<PlatformToken> {
    const [newToken] = await db
      .insert(platformTokens)
      .values({ id: crypto.randomUUID(), ...token })
      .onConflictDoUpdate({
        target: [platformTokens.userId, platformTokens.platform],
        set: {
          ...token,
          updatedAt: new Date(),
        },
      })
      .returning();
    return newToken;
  }

  async getUserPlatformTokens(userId: string): Promise<PlatformToken[]> {
    return await db
      .select()
      .from(platformTokens)
      .where(eq(platformTokens.userId, userId));
  }

  async getPlatformToken(
    userId: string,
    platform: string,
  ): Promise<PlatformToken | undefined> {
    const [token] = await db
      .select()
      .from(platformTokens)
      .where(
        and(
          eq(platformTokens.userId, userId),
          eq(platformTokens.platform, platform),
        ),
      );
    return token;
  }

  async deletePlatformToken(userId: string, platform: string): Promise<void> {
    await db
      .delete(platformTokens)
      .where(
        and(
          eq(platformTokens.userId, userId),
          eq(platformTokens.platform, platform),
        ),
      );
  }
}

export const storage = new DatabaseStorage();
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { nanoid } from "nanoid";
import * as schema from "@shared/schema";
import type {
  UpsertUser,
  InsertVideo,
  InsertAiJob,
  InsertScheduledPost,
  InsertPlatformToken,
} from "@shared/schema";

class Storage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    const sql = neon(connectionString);
    this.db = drizzle(sql, { schema });
  }

  // Users
  async getUser(id: string) {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return user;
  }

  async upsertUser(userData: UpsertUser) {
    const [user] = await this.db
      .insert(schema.users)
      .values({
        ...userData,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Videos
  async getVideos(userId: string, cursor?: string, limit: number = 20) {
    let query = this.db
      .select()
      .from(schema.videos)
      .where(eq(schema.videos.userId, userId))
      .orderBy(desc(schema.videos.createdAt))
      .limit(limit + 1);

    if (cursor) {
      const cursorDate = new Date(cursor);
      query = query.where(
        and(
          eq(schema.videos.userId, userId),
          lte(schema.videos.createdAt, cursorDate),
        ),
      );
    }

    const videos = await query;
    const hasMore = videos.length > limit;
    const items = hasMore ? videos.slice(0, -1) : videos;
    const nextCursor = hasMore
      ? items[items.length - 1]?.createdAt?.toISOString()
      : undefined;

    return {
      videos: items,
      nextCursor,
      hasMore,
    };
  }

  async getVideo(id: string) {
    const [video] = await this.db
      .select()
      .from(schema.videos)
      .where(eq(schema.videos.id, id))
      .limit(1);
    return video;
  }

  async createVideo(videoData: InsertVideo) {
    const [video] = await this.db
      .insert(schema.videos)
      .values({
        id: nanoid(),
        ...videoData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return video;
  }

  async updateVideo(id: string, updates: Partial<InsertVideo>) {
    const [video] = await this.db
      .update(schema.videos)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.videos.id, id))
      .returning();
    return video;
  }

  // AI Jobs
  async createAiJob(jobData: InsertAiJob) {
    const [job] = await this.db
      .insert(schema.aiJobs)
      .values({
        id: nanoid(),
        ...jobData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return job;
  }

  async getAiJob(id: string) {
    const [job] = await this.db
      .select()
      .from(schema.aiJobs)
      .where(eq(schema.aiJobs.id, id))
      .limit(1);
    return job;
  }

  async getUserAiJobs(userId: string) {
    const jobs = await this.db
      .select()
      .from(schema.aiJobs)
      .where(eq(schema.aiJobs.userId, userId))
      .orderBy(desc(schema.aiJobs.createdAt))
      .limit(50);
    return jobs;
  }

  async updateAiJob(id: string, updates: Partial<InsertAiJob>) {
    const [job] = await this.db
      .update(schema.aiJobs)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.aiJobs.id, id))
      .returning();
    return job;
  }

  // Scheduled Posts
  async createScheduledPost(postData: InsertScheduledPost) {
    const [post] = await this.db
      .insert(schema.scheduledPosts)
      .values({
        id: nanoid(),
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return post;
  }

  async getUserScheduledPosts(userId: string) {
    const posts = await this.db
      .select()
      .from(schema.scheduledPosts)
      .where(eq(schema.scheduledPosts.userId, userId))
      .orderBy(desc(schema.scheduledPosts.scheduleAt))
      .limit(100);
    return posts;
  }

  async updateScheduledPost(id: string, updates: Partial<InsertScheduledPost>) {
    const [post] = await this.db
      .update(schema.scheduledPosts)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.scheduledPosts.id, id))
      .returning();
    return post;
  }

  // Platform Tokens
  async createPlatformToken(tokenData: InsertPlatformToken) {
    const [token] = await this.db
      .insert(schema.platformTokens)
      .values({
        id: nanoid(),
        ...tokenData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    return token;
  }

  async getUserPlatformTokens(userId: string) {
    const tokens = await this.db
      .select()
      .from(schema.platformTokens)
      .where(eq(schema.platformTokens.userId, userId));
    return tokens;
  }

  async deletePlatformToken(userId: string, platform: string) {
    await this.db
      .delete(schema.platformTokens)
      .where(
        and(
          eq(schema.platformTokens.userId, userId),
          eq(schema.platformTokens.platform, platform),
        ),
      );
  }

  async updatePlatformToken(
    userId: string,
    platform: string,
    updates: Partial<InsertPlatformToken>,
  ) {
    const [token] = await this.db
      .update(schema.platformTokens)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.platformTokens.userId, userId),
          eq(schema.platformTokens.platform, platform),
        ),
      )
      .returning();
    return token;
  }
}

export const filestorage = new Storage();
