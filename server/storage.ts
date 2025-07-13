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
import { getDb } from "./db"; // <-- Corrected import for the DB getter
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
    const db = await getDb(); // <-- Await the DB instance
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const db = await getDb(); // <-- Await the DB instance
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
    const db = await getDb(); // <-- Await the DB instance
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
    const db = await getDb(); // <-- Await the DB instance
    const [newVideo] = await db
      .insert(videos)
      .values({ id: crypto.randomUUID(), ...video })
      .returning();
    return newVideo;
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video> {
    const db = await getDb(); // <-- Await the DB instance
    const [updatedVideo] = await db
      .update(videos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo;
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const db = await getDb(); // <-- Await the DB instance
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  // AI Job operations
  async createAiJob(job: InsertAiJob): Promise<AiJob> {
    const db = await getDb(); // <-- Await the DB instance
    const [newJob] = await db
      .insert(aiJobs)
      .values({ id: crypto.randomUUID(), ...job })
      .returning();
    return newJob;
  }

  async updateAiJob(id: string, updates: Partial<AiJob>): Promise<AiJob> {
    const db = await getDb(); // <-- Await the DB instance
    const [updatedJob] = await db
      .update(aiJobs)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(aiJobs.id, id))
      .returning();
    return updatedJob;
  }

  async getAiJob(id: string): Promise<AiJob | undefined> {
    const db = await getDb(); // <-- Await the DB instance
    const [job] = await db.select().from(aiJobs).where(eq(aiJobs.id, id));
    return job;
  }

  async getUserAiJobs(userId: string): Promise<AiJob[]> {
    const db = await getDb(); // <-- Await the DB instance
    return await db
      .select()
      .from(aiJobs)
      .where(eq(aiJobs.userId, userId))
      .orderBy(desc(aiJobs.createdAt));
  }

  // Scheduled Post operations
  async createScheduledPost(post: InsertScheduledPost): Promise<ScheduledPost> {
    const db = await getDb(); // <-- Await the DB instance
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
    const db = await getDb(); // <-- Await the DB instance
    const [updatedPost] = await db
      .update(scheduledPosts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(scheduledPosts.id, id))
      .returning();
    return updatedPost;
  }

  async getUserScheduledPosts(userId: string): Promise<ScheduledPost[]> {
    const db = await getDb(); // <-- Await the DB instance
    return await db
      .select()
      .from(scheduledPosts)
      .where(eq(scheduledPosts.userId, userId))
      .orderBy(desc(scheduledPosts.scheduleAt));
  }

  async getPendingScheduledPosts(): Promise<ScheduledPost[]> {
    const db = await getDb(); // <-- Await the DB instance
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
    const db = await getDb(); // <-- Await the DB instance
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
    const db = await getDb(); // <-- Await the DB instance
    return await db
      .select()
      .from(platformTokens)
      .where(eq(platformTokens.userId, userId));
  }

  async getPlatformToken(
    userId: string,
    platform: string,
  ): Promise<PlatformToken | undefined> {
    const db = await getDb(); // <-- Await the DB instance
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
    const db = await getDb(); // <-- Await the DB instance
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

// REMOVED THE DUPLICATE `class Storage` AND RELATED IMPORTS FROM HERE
