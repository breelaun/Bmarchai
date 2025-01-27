import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AutocompleteSearch } from "@/components/AutocompleteSearch";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { useVideo } from '@/contexts/VideoPlayerContext';

const Index = () => {
  const { setActiveVideo } = useVideo();
  const { ref: bottomRef, inView } = useInView();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['embeds', selectedCategory, searchQuery],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const startIndex = Number(pageParam) * 10;
      const endIndex = startIndex + 9;
      
      let query = supabase
        .from('arts_embeds')
        .select('*, arts_categories(name)')
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);

      if (selectedCategory) {
        query = query.eq('arts_categories.name', selectedCategory);
      }

      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === 10 ? allPages.length : undefined;
    },
  });

  useEffect(() => {
    if (inView && !isLoading && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  const embeds = data?.pages.flat() ?? [];

  const handleVideoClick = (embed: any) => {
    setActiveVideo({
      url: embed.embed_url,
      title: embed.title
    });
  };

  return (
    <div className="min-h-screen">
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

      <AutocompleteSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        embeds={embeds}
      />

      <div className="w-full">
        <div className="flex flex-col">
          {embeds.map((embed) => (
            <div 
              key={embed.id} 
              className="relative flex items-stretch border-y border-muted py-2"
            >
              <div className="flex-1 cursor-pointer" onClick={() => handleVideoClick(embed)}>
                <div className="aspect-video w-full">
                  <iframe
                    src={encodeURI(embed.embed_url)}
                    className="w-full h-full pointer-events-none"
                    allowFullScreen
                    title={embed.title}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                className="writing-mode-vertical-rl rotate-180 h-auto py-4 flex items-center justify-center bg-black text-white hover:bg-[#f7bd00] hover:text-black transition-colors duration-200 rounded-none"
                onClick={() => setSelectedCategory(embed.arts_categories?.name || null)}
                style={{ 
                  writingMode: 'vertical-rl'
                }}
              >
                {embed.arts_categories?.name || 'Uncategorized'}
              </Button>
            </div>
          ))}
          
          <div ref={bottomRef} className="py-4 flex justify-center">
            {isFetchingNextPage && (
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
