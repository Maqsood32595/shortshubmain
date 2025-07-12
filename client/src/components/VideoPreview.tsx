import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";

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
  const { data: currentJob } = useQuery({
    queryKey: ["/api/ai/jobs", job.id],
    queryFn: () => api.getAiJob(job.id).then(res => res.json()),
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'processing' ? 2000 : false;
    },
    initialData: job,
  });

  if (!currentJob) return null;

  if (currentJob.status === 'pending' || currentJob.status === 'processing') {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
              <i className="fas fa-cog fa-spin text-white text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Generating Your Video...</h3>
            <p className="text-gray-600 text-sm mb-4">This usually takes 2-5 minutes</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="brand-gradient h-2 rounded-full transition-all duration-500" 
                style={{ width: `${currentJob.progress || 0}%` }}
              ></div>
            </div>
            
            <div className="text-sm text-gray-600">
              {currentJob.status === 'processing' 
                ? `Processing... ${currentJob.progress || 0}%`
                : 'Initializing generation...'
              }
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentJob.status === 'failed') {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-600">Generation Failed</h3>
            <p className="text-gray-600 text-sm mb-4">
              {currentJob.errorMessage || 'Something went wrong while generating your video.'}
            </p>
            <Button 
              onClick={() => {
                // Trigger regeneration
                window.location.reload();
              }}
              variant="outline"
            >
              <i className="fas fa-redo mr-2"></i>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (currentJob.status === 'completed' && currentJob.resultUrl) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Generated Video</h3>
          
          <div className="aspect-9-16 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
            <video
              src={currentJob.resultUrl}
              controls
              className="w-full h-full object-cover"
              poster={currentJob.resultUrl.replace('.mp4', '-thumb.jpg')}
            />
          </div>

          <div className="flex space-x-3">
            <Button 
              variant="outline"
              className="flex-1"
              onClick={() => {
                // Trigger regeneration with same prompt
                window.location.reload();
              }}
            >
              <i className="fas fa-redo mr-2"></i>
              Regenerate
            </Button>
            <Button 
              className="flex-1 brand-gradient text-white"
              onClick={async () => {
                try {
                  await api.createVideo({
                    title: `AI Generated: ${currentJob.prompt.substring(0, 50)}...`,
                    description: currentJob.prompt,
                    sourceUrl: currentJob.resultUrl,
                    thumbnailUrl: currentJob.resultUrl.replace('.mp4', '-thumb.jpg'),
                    duration: 30, // Default duration
                    status: 'ready',
                    metadata: { aiJobId: currentJob.id },
                  });
                  
                  queryClient.invalidateQueries({ queryKey: ["videos"] });
                  
                  alert('Video saved to your library!');
                } catch (error) {
                  alert('Failed to save video to library');
                }
              }}
            >
              <i className="fas fa-save mr-2"></i>
              Save to Library
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

interface VideoPreviewProps {
  job: any;
}

export default function VideoPreview({ job }: VideoPreviewProps) {
  const [currentJob, setCurrentJob] = useState(job);

  // Poll for job updates if it's still processing
  const { data: updatedJob } = useQuery({
    queryKey: [`/api/ai/jobs/${job.id}`],
    queryFn: () => api.getAiJob(job.id).then(res => res.json()),
    refetchInterval: currentJob.status === 'processing' ? 2000 : false,
    enabled: !!job.id && currentJob.status === 'processing',
  });

  useEffect(() => {
    if (updatedJob) {
      setCurrentJob(updatedJob);
    }
  }, [updatedJob]);

  const getStatusIcon = () => {
    switch (currentJob.status) {
      case 'pending':
        return 'fas fa-clock';
      case 'processing':
        return 'fas fa-cog fa-spin';
      case 'completed':
        return 'fas fa-check-circle';
      case 'failed':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const getStatusColor = () => {
    switch (currentJob.status) {
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = () => {
    switch (currentJob.status) {
      case 'pending':
        return 'Queued for processing...';
      case 'processing':
        return `Generating video... ${currentJob.progress || 0}%`;
      case 'completed':
        return 'Video generated successfully!';
      case 'failed':
        return currentJob.errorMessage || 'Generation failed';
      default:
        return 'Unknown status';
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Generation</h3>
          <div className={`flex items-center ${getStatusColor()}`}>
            <i className={`${getStatusIcon()} mr-2`}></i>
            <span className="text-sm font-medium capitalize">{currentJob.status}</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Prompt */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Prompt</h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {currentJob.prompt}
            </p>
          </div>

          {/* Progress */}
          {currentJob.status === 'processing' && (
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{currentJob.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="brand-gradient h-2 rounded-full transition-all duration-500"
                  style={{ width: `${currentJob.progress || 0}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Status message */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <i className={`${getStatusIcon()} ${getStatusColor()} mr-2`}></i>
            {getStatusText()}
          </div>

          {/* Video preview */}
          {currentJob.status === 'completed' && currentJob.resultUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
              <video
                src={currentJob.resultUrl}
                controls
                className="w-full h-full object-cover"
                poster={currentJob.resultUrl.replace('.mp4', '-thumb.jpg')}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Actions */}
          {currentJob.status === 'completed' && (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = currentJob.resultUrl;
                  link.download = `ai-video-${currentJob.id}.mp4`;
                  link.click();
                }}
              >
                <i className="fas fa-download mr-2"></i>
                Download
              </Button>
              
              <Button
                size="sm"
                className="brand-gradient text-white"
                onClick={() => {
                  // This would typically navigate to the scheduler
                  window.location.href = `/scheduler/${currentJob.id}`;
                }}
              >
                <i className="fas fa-calendar-plus mr-2"></i>
                Schedule Post
              </Button>
            </div>
          )}

          {/* Retry button for failed jobs */}
          {currentJob.status === 'failed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // This would trigger a retry
                console.log('Retry generation');
              }}
            >
              <i className="fas fa-redo mr-2"></i>
              Retry Generation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
