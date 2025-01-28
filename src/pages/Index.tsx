import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVideo } from "@/contexts/VideoPlayerContext";

const EnhancedVideoManager = () => {
  const { setActiveVideo } = useVideo();
  const { ref: bottomRef, inView } = useInView();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchVideos = async ({ pageParam = 0 }) => {
    const startIndex = pageParam * 10;
    const endIndex = startIndex + 9;
    
    const artsQuery = supabase
      .from('arts_embeds')
      .select('*, arts_categories(name)')
      .order('created_at', { ascending: false });

    const youtubeQuery = supabase
      .from('youtube_embeds')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    const sessionsQuery = supabase
      .from('sessions')
      .select('*')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });

    if (searchQuery) {
      artsQuery.ilike('title', `%${searchQuery}%`);
      youtubeQuery.ilike('title', `%${searchQuery}%`);
      sessionsQuery.ilike('name', `%${searchQuery}%`);
    }

    if (selectedCategory) {
      artsQuery.eq('arts_categories.name', selectedCategory);
      youtubeQuery.eq('arts_categories.name', selectedCategory);
    }

    const [artsData, youtubeData, sessionsData] = await Promise.all([
      artsQuery.range(startIndex, endIndex),
      youtubeQuery.range(startIndex, endIndex),
      sessionsQuery.range(startIndex, endIndex),
    ]);

    return {
      arts: artsData.data || [],
      youtube: youtubeData.data || [],
      sessions: sessionsData.data || [],
    };
  };

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['all-videos', selectedCategory, searchQuery, activeTab],
    queryFn: fetchVideos,
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = lastPage.arts.length + lastPage.youtube.length + lastPage.sessions.length;
      return totalItems === 30 ? allPages.length : undefined;
    },
  });

  useEffect(() => {
    if (inView && !isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const handleVideoClick = (video) => {
    const embedUrl = video.embed_url || 
      (video.embed_id ? `https://www.youtube.com/embed/${video.embed_id}` : null);

    if (embedUrl) {
      setActiveVideo({
        url: embedUrl,
        title: video.title || video.name
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative w-full h-[500px] md:h-[750px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50">
          <img 
            src="/lovable-uploads/Banner01.jpg" 
            alt="Hero Banner" 
            className="w-full h-full object-cover -z-10"
          />
        </div>
        <div className="relative h-full flex flex-col justify-center px-4 md:px-12 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-heading mb-4">
            Your Ultimate Platform for
            <span className="text-gradient"> Fitness & Sports</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8">
            Transform your fitness journey with personalized meal plans, workout tracking, and expert guidance.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <div className="mx-auto py-4 px-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {selectedCategory}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory(null)} />
            </Badge>
          )}
        </div>
      </div>

      {/* Simple Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="flex flex-col">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {[...page.arts, ...page.youtube].map((video) => (
                  <div 
                    key={video.id} 
                    className="relative flex items-stretch border-y border-muted py-2"
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => handleVideoClick(video)}>
                      <div className="aspect-video w-full">
                        <iframe
                          src={video.embed_url || `https://www.youtube.com/embed/${video.embed_id}`}
                          className="w-full h-full pointer-events-none"
                          allowFullScreen
                          title={video.title}
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="writing-mode-vertical-rl rotate-180 h-auto py-4 flex items-center justify-center bg-black text-white hover:bg-[#f7bd00] hover:text-black transition-colors duration-200 rounded-none"
                      onClick={() => setSelectedCategory(
                        'arts_categories' in video 
                          ? video.arts_categories?.name || null
                          : video.category
                      )}
                      style={{ writingMode: 'vertical-rl' }}
                    >
                      {'arts_categories' in video 
                        ? video.arts_categories?.name || 'Uncategorized'
                        : video.category}
                    </Button>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sessions">
          <div className="flex flex-col">
            {data?.pages.map((page, i) => (
              <React.Fragment key={i}>
                {page.sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className="relative flex items-stretch border-y border-muted py-2"
                  >
                    <div className="flex-1 cursor-pointer" onClick={() => handleVideoClick(session)}>
                      <div className="aspect-video w-full">
                        {session.embed_url && (
                          <iframe
                            src={session.embed_url}
                            className="w-full h-full pointer-events-none"
                            allowFullScreen
                            title={session.name}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Loading indicator */}
      <div ref={bottomRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        )}
      </div>
    </div>
  );
};

export default EnhancedVideoManager;
