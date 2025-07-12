import { Link } from "wouter";

interface VideoCardProps {
  video: {
    id: string;
    title: string;
    thumbnailUrl?: string;
    duration?: number;
    status: string;
    createdAt: string;
  };
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
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="aspect-9-16 relative overflow-hidden">
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
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <div className="absolute top-3 right-3">
            <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full font-mono">
              {formatDuration(video.duration)}
            </span>
          </div>
          
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-medium text-sm mb-1 line-clamp-2">
              {video.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-300">
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 ${getStatusColor(video.status)} rounded-full`}></div>
                <span>{getStatusText(video.status)}</span>
              </div>
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <i className="fas fa-play text-white text-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
