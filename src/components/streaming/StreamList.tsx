import { Stream } from "./types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface StreamListProps {
  streams: Stream[];
  selectedStream: Stream | null;
  onStreamSelect: (stream: Stream) => void;
}

const StreamList = ({ streams, selectedStream, onStreamSelect }: StreamListProps) => {
  if (streams.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No streams available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Available Streams</h2>
      <div className="space-y-2">
        {streams.map((stream) => (
          <div
            key={stream.id}
            className={cn(
              "p-4 rounded-lg cursor-pointer transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              selectedStream?.id === stream.id ? "bg-accent text-accent-foreground" : "bg-card"
            )}
            onClick={() => onStreamSelect(stream)}
          >
            <div className="flex items-start space-x-4">
              <div className="relative aspect-video w-40 rounded-md overflow-hidden">
                <img
                  src={stream.thumbnail}
                  alt={stream.title}
                  className="object-cover w-full h-full"
                />
                {stream.isLive ? (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 rounded text-xs font-medium text-white">
                    LIVE
                  </div>
                ) : (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gray-500 rounded text-xs font-medium text-white">
                    RECORDED
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium line-clamp-2">{stream.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stream.category}</p>
                {stream.isLive ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    {stream.viewerCount.toLocaleString()} watching
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(stream.publishedAt), { addSuffix: true })}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StreamList;