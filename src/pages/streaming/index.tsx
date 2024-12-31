import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import StreamList from "@/components/streaming/StreamList";
import VideoPlayer from "@/components/streaming/VideoPlayer";
import StreamFilters from "@/components/streaming/StreamFilters";
import { Stream } from "@/components/streaming/types";

const mockStreams: Stream[] = [
  {
    id: "1",
    title: "Pro Pickleball Championship Finals",
    category: "Pickleball",
    thumbnail: "/placeholder.svg",
    url: "https://www.youtube.com/embed/live_stream?channel=UC5TPYuXy_SxF1nGRDYBw7WA",
    isLive: true,
    viewerCount: 1200,
  },
  {
    id: "2",
    title: "World Figure Skating Championships 2024",
    category: "Figure Skating",
    thumbnail: "/placeholder.svg",
    url: "https://www.youtube.com/embed/live_stream?channel=UC5TPYuXy_SxF1nGRDYBw7WA",
    isLive: true,
    viewerCount: 3500,
  },
];

const StreamingPage = () => {
  const [streams] = useState<Stream[]>(mockStreams);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredStreams = streams.filter((stream) => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || stream.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
                <p className="text-muted-foreground">Select a stream to watch</p>
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