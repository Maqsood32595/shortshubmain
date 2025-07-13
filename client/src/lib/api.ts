import { apiRequest } from "./queryClient";

class ApiClient {
  async get(url: string) {
    const response = await fetch(url, {
      credentials: "include",
    });
    return response;
  }

  async post(url: string, data?: any) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    return response;
  }

  async put(url: string, data?: any) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    return response;
  }

  async delete(url: string) {
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });
    return response;
  }

  // Auth
  async getUser() {
    return this.get("/api/auth/user");
  }

  // Videos
  async getVideos(cursor?: string, limit?: number) {
    const params = new URLSearchParams();
    if (cursor) params.append("cursor", cursor);
    if (limit) params.append("limit", limit.toString());
    const query = params.toString();
    return this.get(`/api/videos${query ? `?${query}` : ""}`);
  }

  async getVideo(id: string) {
    return this.get(`/api/videos/${id}`);
  }

  async createVideo(data: any) {
    return this.post("/api/videos", data);
  }

  // AI Jobs
  async generateVideo(data: {
    prompt: string;
    style: string;
    duration: number;
  }) {
    return this.post("/api/ai/generate", data);
  }

  async getAiJob(id: string) {
    return this.get(`/api/ai/jobs/${id}`);
  }

  async getAiJobs() {
    return this.get("/api/ai/jobs");
  }

  // Scheduling
  async schedulePost(data: any) {
    return this.post("/api/schedule", data);
  }

  async getScheduledPosts() {
    return this.get("/api/schedule");
  }

  // Platforms
  async getPlatforms() {
    return this.get("/api/platforms");
  }

  async disconnectPlatform(platform: string) {
    return this.delete(`/api/platforms/${platform}`);
  }

  // Stats
  async getStats() {
    return this.get("/api/stats");
  }
}

export const api = new ApiClient();