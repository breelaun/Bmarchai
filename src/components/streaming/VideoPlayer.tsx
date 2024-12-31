import { Stream } from "./types";

interface VideoPlayerProps {
  stream: Stream;
}

const VideoPlayer = ({ stream }: VideoPlayerProps) => {
  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={stream.url}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold">{stream.title}</h2>
        <p className="text-muted-foreground mt-1">
          {stream.viewerCount.toLocaleString()} watching
        </p>
      </div>
    </div>
  );
};

export default VideoPlayer;