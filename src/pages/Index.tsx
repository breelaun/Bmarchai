import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, X, Calendar, Clock } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useVideo } from "@/contexts/VideoPlayerContext";
import { formatToLocalTime } from '@/utils/timezone';

interface BaseEmbed {
  id: string;
  title: string;
  embed_url?: string;
  embed_id?: string;
  embed_type?: string;
}

interface ArtsEmbed extends BaseEmbed {
  category: string;
  arts_categories: {
    name: string;
  } | null;
}

interface YouTubeEmbed extends BaseEmbed {
  category: string;
  active: boolean;
}

interface SessionEmbed extends BaseEmbed {
  start_time: string;
  duration: string;
  description: string;
  vendor_id: string;
}

const EnhancedVideoManager = () => {
  const { setActiveVideo } = useVideo();
  const { ref: bottomRef, inView } = useInView();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const fetchVideos = async ({ pageParam = 0 }) => {
    const startIndex = pageParam * 10;
    const endIndex = startIndex + 9;
    
    // Fetch arts embeds
    const artsQuery = supabase
      .from('arts_embeds')
      .select('*, arts_categories(name)')
      .order('created_at', { ascending: false });

    // Fetch YouTube embeds
    const youtubeQuery = supabase
      .from('youtube_embeds')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    // Fetch sessions
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
      youtubeQuery.eq('category', selectedCategory);
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

  const handleVideoClick = (video: ArtsEmbed | YouTubeEmbed | SessionEmbed) => {
    const embedUrl = 'embed_url' in video 
      ? video.embed_url 
      : 'embed_id' in video 
        ? `https://www.youtube.com/embed/${video.embed_id}`
        : null;

    if (embedUrl) {
      setActiveVideo({
        url: embedUrl,
        title: video.title
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Videos</TabsTrigger>
          <TabsTrigger value="sessions">Upcoming Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {[...page.arts, ...page.youtube].map((video) => (
                <Card key={video.id} className="hover:bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 cursor-pointer" onClick={() => handleVideoClick(video)}>
                        <h3 className="font-semibold">{video.title}</h3>
                        <div className="aspect-video w-full mt-2">
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
                        className="ml-4"
                        onClick={() => setSelectedCategory(
                          'arts_categories' in video 
                            ? video.arts_categories?.name || null
                            : video.category
                        )}
                      >
                        {'arts_categories' in video 
                          ? video.arts_categories?.name || 'Uncategorized'
                          : video.category}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </React.Fragment>
          ))}
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.sessions.map((session) => (
                <Card key={session.id} className="hover:bg-accent/5">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{session.name}</h3>
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatToLocalTime(session.start_time, 'UTC')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Duration: {session.duration}
                          </span>
                        </div>
                        {session.embed_url && (
                          <div className="aspect-video w-full mt-4 cursor-pointer" onClick={() => handleVideoClick(session)}>
                            <iframe
                              src={session.embed_url}
                              className="w-full h-full pointer-events-none"
                              allowFullScreen
                              title={session.name}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </React.Fragment>
          ))}
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
