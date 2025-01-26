import React from 'react';

interface VideoProps {
  videoUrl: string;
  category: string;
}

const VideoPlayer: React.FC<ArtsEmbed> = (embed) => {
  return (
    <div className="flex items-center justify-between">
      <div className="w-3/4">
        <video controls>
          <source src={embed.video_url} type="video/mp4" />
        </video>
      </div>
      <div className="w-1/4 flex items-center justify-center">
        <span className="text-white text-2xl font-bold"
              style={{ writingMode: 'vertical-lr', textOrientation: 'mixed' }}>
          {embed.category?.name}
        </span>
      </div>
    </div>
  );
};

const IndexPage: React.FC = () => {
  const { data: embeds } = useQuery({
    queryKey: ["arts-embeds"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("arts_embeds")
        .select(`
          *,
          category:category_id(
            name
          )
        `)
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8">
      {embeds?.map((embed) => (
        <div key={embed.id} className="mb-8">
          <VideoPlayer {...embed} />
        </div>
      ))}
    </div>
  );
};

export default IndexPage;
