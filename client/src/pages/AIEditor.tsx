import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Navigation from "@/components/Navigation";
import PromptInput from "@/components/PromptInput";
import VideoPreview from "@/components/VideoPreview";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function AIEditor() {
  const [currentJob, setCurrentJob] = useState<any>(null);
  const { toast } = useToast();

  const { data: recentJobs } = useQuery({
    queryKey: ["/api/ai/jobs"],
    queryFn: () => api.getAiJobs().then(res => res.json()),
  });

  const generateMutation = useMutation({
    mutationFn: api.generateVideo,
    onSuccess: (response) => {
      response.json().then((job) => {
        setCurrentJob(job);
        toast({
          title: "Generation Started",
          description: "Your AI video is being generated. This usually takes 2-5 minutes.",
        });
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = (data: { prompt: string; style: string; duration: number }) => {
    generateMutation.mutate(data);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">AI Create</h1>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <i className="fas fa-question-circle text-gray-600"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Prompt Input */}
        <PromptInput 
          onGenerate={handleGenerate} 
          loading={generateMutation.isPending} 
        />

        {/* Current Job */}
        {currentJob && (
          <VideoPreview job={currentJob} />
        )}

        {/* Recent Generations */}
        {recentJobs && recentJobs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Recent Generations</h3>
            <div className="grid grid-cols-2 gap-4">
              {recentJobs.slice(0, 6).map((job: any) => (
                <Card key={job.id} className="border-0 shadow-sm cursor-pointer hover:shadow-md transition-all duration-300" onClick={() => setCurrentJob(job)}>
                  <div className="aspect-9-16 relative rounded-t-lg overflow-hidden">
                    {job.resultUrl ? (
                      <img 
                        src={job.resultUrl.replace('.mp4', '-thumb.jpg')} 
                        alt={job.prompt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full brand-gradient flex items-center justify-center ${job.resultUrl ? 'hidden' : ''}`}>
                      {job.status === 'processing' ? (
                        <i className="fas fa-cog fa-spin text-white text-2xl"></i>
                      ) : job.status === 'failed' ? (
                        <i className="fas fa-exclamation-triangle text-white text-2xl"></i>
                      ) : (
                        <i className="fas fa-video text-white text-2xl"></i>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-white text-xs font-medium line-clamp-2">
                        {job.prompt.substring(0, 40)}...
                      </span>
                    </div>
                    {job.status === 'processing' && (
                      <div className="absolute top-2 right-2">
                        <div className="w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                          <i className="fas fa-clock text-white text-xs"></i>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!recentJobs || recentJobs.length === 0) && !currentJob && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-magic text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Create Your First AI Video</h3>
              <p className="text-sm text-gray-600">
                Describe what you want to see and our AI will generate a unique video for you
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Navigation />
    </div>
  );
}
