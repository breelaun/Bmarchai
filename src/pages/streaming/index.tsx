import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import StreamList from "@/components/streaming/StreamList";
import VideoPlayer from "@/components/streaming/VideoPlayer";
import StreamFilters from "@/components/streaming/StreamFilters";
import { Stream } from "@/components/streaming/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const StreamingPage = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchStreams = async (category: string | null) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-youtube-streams', {
        body: { category: category || 'Pickleball' },
      });

      if (error) throw error;
      setStreams(data.streams);
    } catch (error) {
      console.error('Error fetching streams:', error);
      toast({
        title: "Error",
        description: "Failed to fetch live streams. Please try again later.",
        variant: "destructive",
      });
      setStreams([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStreams(selectedCategory);
  }, [selectedCategory]);

  const filteredStreams = streams.filter((stream) => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Live Sports Streaming</h1>
          <p className="text-muted-foreground">
            Watch live streams of your favorite niche sports
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search streams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <StreamFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {selectedStream ? (
              <VideoPlayer stream={selectedStream} />
            ) : (
              <div className="aspect-video bg-card rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  {isLoading ? "Loading streams..." : "Select a stream to watch"}
                </p>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">
            <StreamList
              streams={filteredStreams}
              selectedStream={selectedStream}
              onStreamSelect={setSelectedStream}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingPage;