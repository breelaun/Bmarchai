import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ContentGrid from "@/components/content/ContentGrid";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['content'],
    queryFn: async ({ pageParam = 1 }) => {
      const { data: arts } = await supabase
        .from('arts_embeds')
        .select('*')
        .range((pageParam - 1) * 10, pageParam * 10 - 1);

      const { data: youtube } = await supabase
        .from('youtube_embeds')
        .select('*')
        .range((pageParam - 1) * 10, pageParam * 10 - 1);

      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .range((pageParam - 1) * 10, pageParam * 10 - 1);

      return {
        arts: arts || [],
        youtube: youtube || [],
        sessions: sessions || []
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('content_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'arts_embeds',
        },
        (payload) => {
          console.log('Change received!', payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const allContent = data?.pages.reduce(
    (acc, page) => ({
      arts: [...acc.arts, ...page.arts],
      youtube: [...acc.youtube, ...page.youtube],
      sessions: [...acc.sessions, ...page.sessions],
    }),
    { arts: [], youtube: [], sessions: [] }
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Bmarchai</h1>
      
      {allContent && <ContentGrid content={allContent} />}
      
      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Index;