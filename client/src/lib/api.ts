import { apiRequest } from "./queryClient";

export const api = {
  // Auth
  getUser: () => 
    apiRequest("GET", "/api/auth/user"),

  // Videos
  getVideos: (cursor?: string) => 
    apiRequest("GET", `/api/videos${cursor ? `?cursor=${cursor}` : ""}`),
  
  getVideo: (id: string) =>
    apiRequest("GET", `/api/videos/${id}`),
  
  createVideo: (data: any) =>
    apiRequest("POST", "/api/videos", data),

  // AI Generation
  generateVideo: (data: { prompt: string; style?: string; duration?: number }) =>
    apiRequest("POST", "/api/ai/generate", data),
  
  getAiJob: (id: string) =>
    apiRequest("GET", `/api/ai/jobs/${id}`),
  
  getAiJobs: () =>
    apiRequest("GET", "/api/ai/jobs"),

  // Scheduling
  schedulePost: (data: any) =>
    apiRequest("POST", "/api/schedule", data),
  
  getScheduledPosts: () =>
    apiRequest("GET", "/api/schedule"),

  // Platforms
  getPlatforms: () =>
    apiRequest("GET", "/api/platforms"),
  
  disconnectPlatform: (platform: string) =>
    apiRequest("DELETE", `/api/platforms/${platform}`),

  // Stats
  getStats: () =>
    apiRequest("GET", "/api/stats"),
};
