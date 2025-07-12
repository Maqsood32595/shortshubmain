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
