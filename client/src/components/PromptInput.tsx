import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  onGenerate: (data: { prompt: string; style: string; duration: number }) => void;
  loading: boolean;
}

export default function PromptInput({ onGenerate, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState(30);

  const styles = [
    { id: "cinematic", label: "Cinematic", icon: "fas fa-film" },
    { id: "artistic", label: "Artistic", icon: "fas fa-palette" },
    { id: "animated", label: "Animated", icon: "fas fa-gamepad" },
  ];

  const durations = [15, 30, 60];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      onGenerate({ prompt: prompt.trim(), style, duration });
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Describe Your Video</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea 
              rows={4}
              placeholder="Describe the video you want to create... e.g., 'A cat playing with a ball of yarn in slow motion with cinematic lighting'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="resize-none"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {prompt.length}/500
            </div>
          </div>

          {/* Style Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Style</label>
            <div className="grid grid-cols-3 gap-2">
              {styles.map((styleOption) => (
                <button
                  key={styleOption.id}
                  type="button"
                  onClick={() => setStyle(styleOption.id)}
                  className={`p-3 border-2 rounded-lg text-center transition-colors ${
                    style === styleOption.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <i className={`${styleOption.icon} ${
                    style === styleOption.id ? "text-blue-600" : "text-gray-600"
                  } mb-1 block`}></i>
                  <span className={`text-xs font-medium ${
                    style === styleOption.id ? "text-blue-600" : "text-gray-600"
                  }`}>
                    {styleOption.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Duration</label>
            <div className="flex space-x-2">
              {durations.map((durationOption) => (
                <button
                  key={durationOption}
                  type="button"
                  onClick={() => setDuration(durationOption)}
                  className={`flex-1 p-3 border-2 rounded-lg text-center transition-colors ${
                    duration === durationOption
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    duration === durationOption ? "text-blue-600" : "text-gray-600"
                  }`}>
                    {durationOption}s
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!prompt.trim() || loading}
            className="w-full brand-gradient text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2"></i>
                Generate Video
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  onGenerate: (data: { prompt: string; style: string; duration: number }) => void;
  loading: boolean;
}

export default function PromptInput({ onGenerate, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState(30);

  const styles = [
    { value: "cinematic", label: "Cinematic", description: "Professional, movie-like quality" },
    { value: "cartoon", label: "Cartoon", description: "Animated, colorful style" },
    { value: "realistic", label: "Realistic", description: "Photorealistic imagery" },
    { value: "abstract", label: "Abstract", description: "Artistic, conceptual style" },
  ];

  const durations = [15, 30, 60];

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate({ prompt: prompt.trim(), style, duration });
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Describe Your Video</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Description
            </label>
            <Textarea
              placeholder="A cat playing with a ball of yarn in a sunny garden..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific and descriptive for better results
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <div className="grid grid-cols-2 gap-2">
              {styles.map((styleOption) => (
                <button
                  key={styleOption.value}
                  onClick={() => setStyle(styleOption.value)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    style === styleOption.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-sm">{styleOption.label}</div>
                  <div className="text-xs text-gray-600">{styleOption.description}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
            <div className="flex space-x-2">
              {durations.map((dur) => (
                <button
                  key={dur}
                  onClick={() => setDuration(dur)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    duration === dur
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>
          
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="w-full brand-gradient text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            {loading ? (
              <>
                <i className="fas fa-cog fa-spin mr-2"></i>
                Generating...
              </>
            ) : (
              <>
                <i className="fas fa-magic mr-2"></i>
                Generate Video
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
