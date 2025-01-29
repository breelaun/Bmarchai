import { Card, CardContent } from "@/components/ui/card";

interface ContentGridProps {
  content: {
    arts: any[];
    youtube: any[];
    sessions: any[];
  };
}

const ContentGrid = ({ content }: ContentGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {content.arts.map((art) => (
        <Card key={art.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold">{art.title}</h3>
            <div className="aspect-video mt-2">
              <iframe
                src={art.embed_url}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {content.youtube.map((video) => (
        <Card key={video.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold">{video.title}</h3>
            <div className="aspect-video mt-2">
              <iframe
                src={`https://www.youtube.com/embed/${video.embed_id}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      ))}
      
      {content.sessions.map((session) => (
        <Card key={session.id}>
          <CardContent className="p-4">
            <h3 className="font-semibold">{session.name}</h3>
            <p className="text-sm text-muted-foreground">{session.description}</p>
            {session.embed_url && (
              <div className="aspect-video mt-2">
                <iframe
                  src={session.embed_url}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContentGrid;