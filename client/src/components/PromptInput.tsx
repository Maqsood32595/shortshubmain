import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface PromptInputProps {
  onGenerate: (data: {
    prompt: string;
    style: string;
    duration: number;
  }) => void;
  loading: boolean;
}

export default function PromptInput({ onGenerate, loading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [duration, setDuration] = useState(30);

  const styles = [
    {
      value: "cinematic",
      label: "Cinematic",
      description: "Professional, movie-like quality",
    },
    {
      value: "cartoon",
      label: "Cartoon",
      description: "Animated, colorful style",
    },
    {
      value: "realistic",
      label: "Realistic",
      description: "Photorealistic imagery",
    },
    {
      value: "abstract",
      label: "Abstract",
      description: "Artistic, conceptual style",
    },
  ];

  const durations = [15, 30, 60];

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate({ prompt: prompt.trim(), style, duration });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !loading) {
      handleGenerate();
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Describe Your Video
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              rows={4}
              placeholder="Describe the video you want to create..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="resize-none"
              maxLength={500}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {prompt.length}/500
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Style
            </label>
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
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="border rounded-md p-2 text-gray-700"
            >
              {durations.map((d) => (
                <option key={d} value={d}>
                  {d} seconds
                </option>
              ))}
            </select>
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
