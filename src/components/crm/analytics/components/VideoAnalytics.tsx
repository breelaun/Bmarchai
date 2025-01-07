import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoAnalyticsProps {
  videos: Array<{
    id: string;
    title: string;
    watch_time_seconds: number;
    view_count: number;
  }>;
}

export const VideoAnalytics = ({ videos }: VideoAnalyticsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Watched Videos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos?.map((video) => (
            <div key={video.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{video.title}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.floor(video.watch_time_seconds / 60)} minutes watched
                </p>
              </div>
              <div className="text-sm font-medium">{video.view_count} views</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};