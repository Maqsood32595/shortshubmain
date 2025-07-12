import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => api.getStats().then(res => res.json()),
  });

  const { data: platforms } = useQuery({
    queryKey: ["/api/platforms"],
    queryFn: () => api.getPlatforms().then(res => res.json()),
  });

  const disconnectMutation = useMutation({
    mutationFn: api.disconnectPlatform,
    onSuccess: () => {
      toast({
        title: "Platform Disconnected",
        description: "Platform has been disconnected successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/platforms"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Disconnection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDisconnect = (platform: string) => {
    if (confirm(`Are you sure you want to disconnect ${platform}?`)) {
      disconnectMutation.mutate(platform);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">Profile</h1>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <i className="fas fa-cog text-gray-600"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 text-center">
            <div className="w-20 h-20 brand-gradient rounded-full mx-auto mb-4 flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-white text-2xl"></i>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {user?.firstName && user?.lastName 
                ? `${user.firstName} ${user.lastName}`
                : "Creator"}
            </h2>
            <p className="text-gray-600 text-sm mb-4">{user?.email}</p>
            
            {stats && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.totalVideos}</div>
                  <div className="text-xs text-gray-600">Videos</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.totalViews}</div>
                  <div className="text-xs text-gray-600">Views</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.followers}</div>
                  <div className="text-xs text-gray-600">Followers</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Connected Accounts</h3>
            <div className="space-y-3">
              {/* TikTok */}
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                    <i className="fab fa-tiktok text-white"></i>
                  </div>
                  <div>
                    <div className="font-medium text-sm">TikTok</div>
                    <div className="text-xs text-green-600">
                      {platforms?.find((p: any) => p.platform === 'tiktok') ? 'Connected' : 'Not connected'}
                    </div>
                  </div>
                </div>
                {platforms?.find((p: any) => p.platform === 'tiktok') ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDisconnect('tiktok')}
                    disabled={disconnectMutation.isPending}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                    Connect
                  </Button>
                )}
              </div>

              {/* Instagram */}
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <i className="fab fa-instagram text-white"></i>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Instagram</div>
                    <div className="text-xs text-green-600">
                      {platforms?.find((p: any) => p.platform === 'instagram') ? 'Connected' : 'Not connected'}
                    </div>
                  </div>
                </div>
                {platforms?.find((p: any) => p.platform === 'instagram') ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDisconnect('instagram')}
                    disabled={disconnectMutation.isPending}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                    Connect
                  </Button>
                )}
              </div>

              {/* YouTube */}
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center mr-3">
                    <i className="fab fa-youtube text-white"></i>
                  </div>
                  <div>
                    <div className="font-medium text-sm">YouTube</div>
                    <div className="text-xs text-gray-500">
                      {platforms?.find((p: any) => p.platform === 'youtube') ? 'Connected' : 'Not connected'}
                    </div>
                  </div>
                </div>
                {platforms?.find((p: any) => p.platform === 'youtube') ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600"
                    onClick={() => handleDisconnect('youtube')}
                    disabled={disconnectMutation.isPending}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600">
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Menu */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <i className="fas fa-bell text-gray-600 mr-3"></i>
              <span className="font-medium text-gray-900">Notifications</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <i className="fas fa-shield-alt text-gray-600 mr-3"></i>
              <span className="font-medium text-gray-900">Privacy & Security</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </button>

          <button className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <i className="fas fa-question-circle text-gray-600 mr-3"></i>
              <span className="font-medium text-gray-900">Help & Support</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </button>

          <button 
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
            onClick={() => window.location.href = "/api/logout"}
          >
            <div className="flex items-center">
              <i className="fas fa-sign-out-alt text-red-500 mr-3"></i>
              <span className="font-medium text-red-500">Sign Out</span>
            </div>
            <i className="fas fa-chevron-right text-gray-400"></i>
          </button>
        </div>
      </main>

      <Navigation />
    </div>
  );
}
