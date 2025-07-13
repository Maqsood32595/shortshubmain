import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface VideoPreviewProps {
  job: {
    id: string;
    prompt: string;
    status: string;
    progress?: number;
    resultUrl?: string;
    errorMessage?: string;
  };
}

export default function VideoPreview({ job }: VideoPreviewProps) {
  const [currentJob, setCurrentJob] = useState(job);

  // Poll for job updates if it's still processing
  const { data: updatedJob } = useQuery({
    queryKey: [`/api/ai/jobs/${job.id}`],
    queryFn: () => api.getAiJob(job.id).then((res) => res.json()),
    refetchInterval: currentJob.status === "processing" ? 2000 : false,
    enabled: !!job.id && currentJob.status === "processing",
  });

  useEffect(() => {
    if (updatedJob) {
      setCurrentJob(updatedJob);
    }
  }, [updatedJob]);

  const getStatusIcon = () => {
    switch (currentJob.status) {
      case "pending":
        return "fas fa-clock";
      case "processing":
        return "fas fa-cog fa-spin";
      case "completed":
        return "fas fa-check-circle";
      case "failed":
        return "fas fa-exclamation-triangle";
      default:
        return "fas fa-question-circle";
    }
  };

  const getStatusColor = () => {
    switch (currentJob.status) {
      case "pending":
        return "text-yellow-600";
      case "processing":
        return "text-blue-600";
      case "completed":
        return "text-green-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (currentJob.status === "completed" && currentJob.resultUrl) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Generated Video</h3>
          <div className="aspect-9-16 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
            <video
              src={currentJob.resultUrl}
              controls
              className="w-full h-full object-cover"
              poster={currentJob.resultUrl.replace(".mp4", "-thumb.jpg")}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center">
      <i className={getStatusIcon()} style={{ color: getStatusColor() }}></i>
      <span className="ml-2">{currentJob.status}</span>
    </div>
  );
}
