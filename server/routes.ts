import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { insertVideoSchema, insertAiJobSchema, insertScheduledPostSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Video routes
  app.get('/api/videos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const cursor = req.query.cursor as string;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await storage.getVideos(userId, cursor, limit);
      res.json(result);
    } catch (error) {
      console.error("Error fetching videos:", error);
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get('/api/videos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const video = await storage.getVideo(req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Check if user owns the video
      if (video.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(video);
    } catch (error) {
      console.error("Error fetching video:", error);
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post('/api/videos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const videoData = insertVideoSchema.parse({
        ...req.body,
        userId,
      });
      
      const video = await storage.createVideo(videoData);
      res.status(201).json(video);
    } catch (error) {
      console.error("Error creating video:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  // AI Job routes
  app.post('/api/ai/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { prompt, style = "cinematic", duration = 30 } = req.body;
      
      if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
        return res.status(400).json({ message: "Prompt is required" });
      }
      
      const jobData = insertAiJobSchema.parse({
        userId,
        prompt: prompt.trim(),
        style,
        duration,
        status: "pending",
      });
      
      const job = await storage.createAiJob(jobData);
      
      // TODO: Trigger AI generation (e.g., send to queue, call external API)
      // For now, simulate the process
      setTimeout(async () => {
        try {
          // Simulate processing
          await storage.updateAiJob(job.id, { status: "processing", progress: 25 });
          
          setTimeout(async () => {
            await storage.updateAiJob(job.id, { progress: 50 });
            
            setTimeout(async () => {
              await storage.updateAiJob(job.id, { progress: 75 });
              
              setTimeout(async () => {
                // Simulate completion
                const resultUrl = `https://example.com/generated-video-${job.id}.mp4`;
                await storage.updateAiJob(job.id, { 
                  status: "completed", 
                  progress: 100, 
                  resultUrl 
                });
                
                // Create video entry
                await storage.createVideo({
                  userId,
                  title: `AI Generated: ${prompt.substring(0, 50)}...`,
                  description: prompt,
                  sourceUrl: resultUrl,
                  thumbnailUrl: `${resultUrl.replace('.mp4', '')}-thumb.jpg`,
                  duration,
                  status: "ready",
                  metadata: { aiJobId: job.id, prompt, style },
                });
              }, 2000);
            }, 2000);
          }, 2000);
        } catch (error) {
          console.error("Error updating AI job:", error);
          await storage.updateAiJob(job.id, { 
            status: "failed", 
            errorMessage: "Failed to generate video" 
          });
        }
      }, 1000);
      
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating AI job:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid job data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create AI generation job" });
    }
  });

  app.get('/api/ai/jobs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const job = await storage.getAiJob(req.params.id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      
      if (job.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(job);
    } catch (error) {
      console.error("Error fetching AI job:", error);
      res.status(500).json({ message: "Failed to fetch AI job" });
    }
  });

  app.get('/api/ai/jobs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const jobs = await storage.getUserAiJobs(userId);
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching AI jobs:", error);
      res.status(500).json({ message: "Failed to fetch AI jobs" });
    }
  });

  // Scheduled Posts routes
  app.post('/api/schedule', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { videoId, platforms, scheduleAt, caption, hashtags } = req.body;
      
      // Validate that the video exists and belongs to the user
      const video = await storage.getVideo(videoId);
      if (!video || video.userId !== userId) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      const postData = insertScheduledPostSchema.parse({
        userId,
        videoId,
        platforms: platforms.map((platform: any) => ({
          ...platform,
          caption,
          hashtags,
        })),
        scheduleAt: new Date(scheduleAt),
        status: "pending",
      });
      
      const scheduledPost = await storage.createScheduledPost(postData);
      res.status(201).json(scheduledPost);
    } catch (error) {
      console.error("Error creating scheduled post:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to schedule post" });
    }
  });

  app.get('/api/schedule', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const scheduledPosts = await storage.getUserScheduledPosts(userId);
      res.json(scheduledPosts);
    } catch (error) {
      console.error("Error fetching scheduled posts:", error);
      res.status(500).json({ message: "Failed to fetch scheduled posts" });
    }
  });

  // Platform Token routes
  app.get('/api/platforms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const tokens = await storage.getUserPlatformTokens(userId);
      
      // Return platform connection status without exposing tokens
      const platforms = tokens.map(token => ({
        platform: token.platform,
        connected: true,
        username: token.platformUsername,
        connectedAt: token.createdAt,
      }));
      
      res.json(platforms);
    } catch (error) {
      console.error("Error fetching platform tokens:", error);
      res.status(500).json({ message: "Failed to fetch platform connections" });
    }
  });

  app.delete('/api/platforms/:platform', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const platform = req.params.platform;
      
      await storage.deletePlatformToken(userId, platform);
      res.status(204).send();
    } catch (error) {
      console.error("Error disconnecting platform:", error);
      res.status(500).json({ message: "Failed to disconnect platform" });
    }
  });

  // Stats route
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { videos } = await storage.getVideos(userId, undefined, 1000); // Get all videos for stats
      
      const totalVideos = videos.length;
      const monthlyVideos = videos.filter(v => {
        const createdAt = new Date(v.createdAt!);
        const now = new Date();
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return createdAt >= monthAgo;
      }).length;
      
      // Mock total views for now - in production this would come from platform APIs
      const totalViews = Math.floor(Math.random() * 1000000) + 100000;
      
      res.json({
        totalVideos,
        monthlyVideos,
        totalViews: totalViews.toLocaleString(),
        followers: Math.floor(Math.random() * 50000) + 5000,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
