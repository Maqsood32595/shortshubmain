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
  onSelectionChange,
}: PlatformSelectorProps) {
  const handlePlatformToggle = (platform: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedPlatforms, platform]);
    } else {
      onSelectionChange(selectedPlatforms.filter((p) => p !== platform));
    }
  };

  const platformInfo = {
    tiktok: { name: "TikTok", color: "bg-black", icon: "fab fa-tiktok" },
    instagram: {
      name: "Instagram",
      color: "bg-gradient-to-br from-purple-600 to-pink-500",
      icon: "fab fa-instagram",
    },
    youtube: { name: "YouTube", color: "bg-red-600", icon: "fab fa-youtube" },
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Select Platforms
        </h2>

        <div className="space-y-3">
          {Object.entries(platformInfo).map(([key, info]) => {
            const platform = platforms.find((p) => p.platform === key);
            const isConnected = platform?.connected || false;
            const isSelected = selectedPlatforms.includes(key);

            return (
              <div
                key={key}
                className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 ${info.color} rounded-lg flex items-center justify-center mr-3`}
                  >
                    <i className={`${info.icon} text-white`}></i>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{info.name}</div>
                    <div
                      className={`text-xs ${isConnected ? "text-green-600" : "text-gray-500"}`}
                    >
                      {isConnected
                        ? `Connected${platform?.username ? ` as ${platform.username}` : ""}`
                        : "Not connected"}
                    </div>
                  </div>
                </div>

                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) =>
                    handlePlatformToggle(key, checked as boolean)
                  }
                  disabled={!isConnected}
                />
              </div>
            );
          })}
        </div>

        {selectedPlatforms.length === 0 && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            Select at least one platform to continue
          </p>
        )}
      </CardContent>
    </Card>
  );
}
