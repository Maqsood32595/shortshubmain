import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import Navigation from "@/components/Navigation";
import PlatformSelector from "@/components/PlatformSelector";
import ScheduleForm from "@/components/ScheduleForm";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Scheduler() {
  const [location] = useLocation();
  const videoId = location.split('/').pop();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleData, setScheduleData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    caption: '',
    hashtags: ['#viral', '#shorts', '#content'],
  });
  const { toast } = useToast();

  const { data: video, isLoading: videoLoading } = useQuery({
    queryKey: ["/api/videos", videoId],
    queryFn: () => videoId ? api.getVideo(videoId).then(res => res.json()) : null,
    enabled: !!videoId,
  });

  const { data: platforms } = useQuery({
    queryKey: ["/api/platforms"],
    queryFn: () => api.getPlatforms().then(res => res.json()),
  });

  const { data: scheduledPosts } = useQuery({
    queryKey: ["/api/schedule"],
    queryFn: () => api.getScheduledPosts().then(res => res.json()),
  });

  const scheduleMutation = useMutation({
    mutationFn: api.schedulePost,
    onSuccess: () => {
      toast({
        title: "Post Scheduled",
        description: "Your video has been scheduled successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/schedule"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Scheduling Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSchedule = () => {
    if (!video || selectedPlatforms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one platform and ensure a video is selected.",
        variant: "destructive",
      });
      return;
    }

    const scheduleAt = new Date(`${scheduleData.date}T${scheduleData.time}`);
    
    const platformConfigs = selectedPlatforms.map(platform => ({
      platform,
      caption: scheduleData.caption,
      hashtags: scheduleData.hashtags,
    }));

    scheduleMutation.mutate({
      videoId: video.id,
      platforms: platformConfigs,
      scheduleAt: scheduleAt.toISOString(),
      caption: scheduleData.caption,
      hashtags: scheduleData.hashtags,
    });
  };

  if (videoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 brand-gradient rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse-slow">
            <i className="fas fa-spinner fa-spin text-white text-sm"></i>
          </div>
          <p className="text-gray-600 text-sm">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Schedule Posts</h1>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <i className="fas fa-calendar-plus text-gray-600"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Selected Video */}
        {video && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Selected Video</h2>
              <div className="flex space-x-4">
                <div className="w-20 aspect-9-16 rounded-lg overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full brand-gradient flex items-center justify-center">
                      <i className="fas fa-video text-white"></i>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Duration: {Math.floor((video.duration || 30) / 60)}:{String((video.duration || 30) % 60).padStart(2, '0')}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <i className="fas fa-calendar mr-1"></i>
                    Created {new Date(video.createdAt!).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Selection */}
        <PlatformSelector 
          platforms={platforms || []}
          selectedPlatforms={selectedPlatforms}
          onSelectionChange={setSelectedPlatforms}
        />

        {/* Schedule Settings */}
        <ScheduleForm 
          scheduleData={scheduleData}
          onDataChange={setScheduleData}
        />

        {/* Post Content */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Post Content</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
                <Textarea 
                  rows={3}
                  placeholder="Write your caption..."
                  value={scheduleData.caption}
                  onChange={(e) => setScheduleData(prev => ({ ...prev, caption: e.target.value }))}
                  className="resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hashtags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {scheduleData.hashtags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                      {tag}
                      <button 
                        onClick={() => setScheduleData(prev => ({
                          ...prev,
                          hashtags: prev.hashtags.filter((_, i) => i !== index)
                        }))}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={() => {
                      const newTag = prompt("Enter hashtag (without #):");
                      if (newTag) {
                        setScheduleData(prev => ({
                          ...prev,
                          hashtags: [...prev.hashtags, `#${newTag}`]
                        }));
                      }
                    }}
                    className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs hover:bg-gray-200 transition-colors"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Button */}
        <Button 
          onClick={handleSchedule}
          disabled={scheduleMutation.isPending || selectedPlatforms.length === 0 || !video}
          className="w-full brand-gradient text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
          {scheduleMutation.isPending ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Scheduling...
            </>
          ) : (
            <>
              <i className="fas fa-calendar-check mr-2"></i>
              Schedule Post
            </>
          )}
        </Button>

        {/* Upcoming Posts */}
        {scheduledPosts && scheduledPosts.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Upcoming Posts</h2>
              
              <div className="space-y-3">
                {scheduledPosts.slice(0, 5).map((post: any) => (
                  <div key={post.id} className="flex items-center p-3 border border-gray-200 rounded-xl">
                    <div className="w-12 aspect-9-16 rounded overflow-hidden mr-3">
                      <div className="w-full h-full brand-gradient flex items-center justify-center">
                        <i className="fas fa-video text-white text-xs"></i>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {post.platforms?.[0]?.caption || "Scheduled Post"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {new Date(post.scheduleAt).toLocaleString()}
                      </div>
                      <div className="flex items-center mt-1">
                        {post.platforms?.map((platform: any, index: number) => (
                          <i key={index} className={`fab fa-${platform.platform} text-xs mr-1 ${
                            platform.platform === 'tiktok' ? 'text-black' :
                            platform.platform === 'instagram' ? 'text-purple-600' :
                            'text-red-600'
                          }`}></i>
                        ))}
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Navigation />
    </div>
  );
}
