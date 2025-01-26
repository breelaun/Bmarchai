import React from 'react';

interface VideoProps {
  videoUrl: string;
  category: string;
}

const VideoPlayer = ({ title, video_url, category_id }: ArtsEmbed) => {
  const { data: category } = useQuery({
    queryKey: ["category", category_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("name")
        .eq("id", category_id)
        .single();
      return data;
    },
  });

  return (
    <div className="flex items-center justify-between">
      <div className="w-3/4">
        <video controls>
          <source src={video_url} type="video/mp4" />
        </video>
      </div>
      <div className="w-1/4 flex items-center justify-center">
        <span className="text-white text-2xl font-bold" style={{ writingMode: 'vertical-lr' }}>
          {category?.name}
        </span>
      </div>
    </div>
  );
};

const IndexPage = () => {
  const { data: videos } = useQuery({
    queryKey: ["arts-embeds"],
    queryFn: async () => {
      const { data } = await supabase
        .from("arts_embeds")
        .select("*");
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8">
      {videos?.map(video => (
        <div key={video.id} className="mb-8">
          <VideoPlayer {...video} />
        </div>
      ))}
    </div>
  );
};

export default IndexPage;
