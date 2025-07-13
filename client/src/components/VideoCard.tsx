import { Link } from "wouter";
import { Card } from "@/components/ui/card";

interface Video {
  id: string;
  title: string;
  thumbnailUrl?: string;
  duration?: number;
  createdAt?: string;
  status: string;
}

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-400';
      case 'processing': return 'bg-blue-400';
      case 'failed': return 'bg-red-400';
      default: return 'bg-yellow-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready': return 'Published';
      case 'processing': return 'Processing';
      case 'failed': return 'Failed';
      default: return 'Pending';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:30';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/scheduler/${video.id}`}>
      <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group">
        <div className="aspect-9-16 relative overflow-hidden rounded-lg">
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

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Status indicator */}
          {video.status === 'processing' && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-black/60 rounded-full flex items-center justify-center">
                <i className="fas fa-cog fa-spin text-white text-xs"></i>
              </div>
            </div>
          )}

          {/* Duration */}
          {video.duration && (
            <div className="absolute top-2 left-2">
              <span className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </span>
            </div>
          )}

          {/* Title and status */}
          <div className="absolute bottom-2 left-2 right-2">
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
              {video.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>{video.createdAt ? new Date(video.createdAt).toLocaleDateString() : ''}</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 ${getStatusColor(video.status)} rounded-full`}></div>
                <span>{getStatusText(video.status)}</span>
              </div>
            </div>
          </div>

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <i className="fas fa-play text-white text-lg"></i>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}