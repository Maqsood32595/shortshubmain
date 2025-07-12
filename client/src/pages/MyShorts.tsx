import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import VideoCard from "@/components/VideoCard";
import { api } from "@/lib/api";

export default function MyShorts() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["videos"],
    queryFn: ({ pageParam }) =>
      api.getVideos(pageParam).then(res => res.json()),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const videos = data?.pages.flatMap(page => page.videos) || [];

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold gradient-text">My Shorts</h1>
            <div className="flex items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <i className="fas fa-search text-gray-600"></i>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <i className="fas fa-bell text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-9-16 bg-gray-200 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 brand-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-video text-white text-xl"></i>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No videos yet</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create your first video with AI or upload your own content
              </p>
              <Link href="/ai">
                <button className="brand-gradient text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
                  <i className="fas fa-magic mr-2"></i>
                  Create with AI
                </button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              {videos.map((video: any) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>

            {/* Load More Trigger */}
            <div ref={ref} className="h-8 flex justify-center pt-8">
              {isFetchingNextPage && (
                <div className="animate-pulse-slow">
                  <div className="w-8 h-8 brand-gradient rounded-full flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin text-white text-sm"></i>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Floating Action Button */}
      <Link href="/ai">
        <button className="fixed bottom-20 right-4 w-14 h-14 brand-gradient rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 hover:scale-110 z-40">
          <i className="fas fa-plus text-xl"></i>
        </button>
      </Link>

      <Navigation />
    </div>
  );
}
