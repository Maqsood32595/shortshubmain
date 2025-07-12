import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { api } from "@/lib/api";

export default function Home() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => api.getStats().then(res => res.json()),
  });

  const { data: recentVideos } = useQuery({
    queryKey: ["/api/videos"],
    queryFn: () => api.getVideos().then(res => res.json()),
  });

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">ShortsHub</h1>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <i className="fas fa-search text-gray-600"></i>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <i className="fas fa-bell text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Card className="border-0 shadow-sm brand-gradient-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.totalVideos || 0}
              </div>
              <div className="text-xs text-gray-600">Videos</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm brand-gradient-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.monthlyVideos || 0}
              </div>
              <div className="text-xs text-gray-600">This Month</div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm brand-gradient-soft">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stats?.totalViews || "0"}
              </div>
              <div className="text-xs text-gray-600">Views</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 mb-8">
          <Link href="/ai">
            <Button className="w-full brand-gradient text-white py-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <i className="fas fa-magic mr-3 text-lg"></i>
              <div className="text-left">
                <div className="font-semibold">Create with AI</div>
                <div className="text-sm opacity-90">Generate videos from text</div>
              </div>
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/shorts">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:shadow-md transition-all">
                <i className="fas fa-video text-lg text-gray-600"></i>
                <span className="text-sm font-medium">My Shorts</span>
              </Button>
            </Link>
            
            <Link href="/scheduler">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:shadow-md transition-all">
                <i className="fas fa-calendar-alt text-lg text-gray-600"></i>
                <span className="text-sm font-medium">Schedule</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Videos */}
        {recentVideos?.videos?.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Videos</h2>
              <Link href="/shorts">
                <Button variant="ghost" size="sm">
                  View All <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {recentVideos.videos.slice(0, 4).map((video: any) => (
                <Link key={video.id} href={`/scheduler/${video.id}`}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
                    <div className="aspect-9-16 relative overflow-hidden rounded-t-lg">
                      {video.thumbnailUrl ? (
                        <img 
                          src={video.thumbnailUrl} 
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full brand-gradient flex items-center justify-center">
                          <i className="fas fa-video text-white text-2xl"></i>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-white font-medium text-xs truncate">
                          {video.title}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!recentVideos?.videos || recentVideos.videos.length === 0) && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-plus text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No videos yet</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create your first video with AI or upload your own content
              </p>
              <Link href="/ai">
                <Button className="brand-gradient text-white">
                  <i className="fas fa-magic mr-2"></i>
                  Create with AI
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>

      <Navigation />
    </div>
  );
}
