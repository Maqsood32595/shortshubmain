import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Platform {
  platform: string;
  connected: boolean;
  username?: string;
}

interface PlatformSelectorProps {
  platforms: Platform[];
  selectedPlatforms: string[];
  onSelectionChange: (platforms: string[]) => void;
}

export default function PlatformSelector({ 
  platforms, 
  selectedPlatforms, 
  onSelectionChange 
}: PlatformSelectorProps) {
  const handlePlatformToggle = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      onSelectionChange(selectedPlatforms.filter(p => p !== platform));
    } else {
      onSelectionChange([...selectedPlatforms, platform]);
    }
  };

  const platformConfigs = {
    tiktok: {
      name: "TikTok",
      icon: "fab fa-tiktok",
      bgColor: "bg-black",
      checkColor: "border-pink-500 bg-pink-500",
      selectedBg: "border-pink-500 bg-pink-50",
    },
    instagram: {
      name: "Instagram Reels", 
      icon: "fab fa-instagram",
      bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
      checkColor: "border-purple-500 bg-purple-500",
      selectedBg: "border-purple-500 bg-purple-50",
    },
    youtube: {
      name: "YouTube Shorts",
      icon: "fab fa-youtube", 
      bgColor: "bg-red-600",
      checkColor: "border-red-500 bg-red-500",
      selectedBg: "border-red-500 bg-red-50",
    },
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Select Platforms</h2>
        <div className="space-y-3">
          {Object.entries(platformConfigs).map(([key, config]) => {
            const platform = platforms.find(p => p.platform === key);
            const isSelected = selectedPlatforms.includes(key);
            const isConnected = platform?.connected || false;
            
            return (
              <label 
                key={key}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                  isSelected 
                    ? config.selectedBg
                    : "border-gray-200 hover:border-gray-300"
                } ${!isConnected ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isSelected}
                  onChange={() => isConnected && handlePlatformToggle(key)}
                  disabled={!isConnected}
                />
                <div className={`w-8 h-8 ${config.bgColor} rounded-lg flex items-center justify-center mr-4`}>
                  <i className={`${config.icon} text-white`}></i>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{config.name}</div>
                  <div className="text-sm text-gray-600">
                    {isConnected 
                      ? `@${platform?.username || 'connected'} • Connected`
                      : 'Not connected'
                    }
                  </div>
                </div>
                <div className={`w-5 h-5 border-2 rounded ${
                  isSelected && isConnected
                    ? `${config.checkColor} flex items-center justify-center`
                    : "border-gray-300"
                }`}>
                  {isSelected && isConnected && (
                    <i className="fas fa-check text-white text-xs"></i>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        
        {platforms.filter(p => p.connected).length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
              <p className="text-sm text-yellow-800">
                Connect at least one platform to schedule posts
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
