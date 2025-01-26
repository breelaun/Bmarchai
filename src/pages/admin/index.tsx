import React from 'react';

interface VideoProps {
  title: string;
  video_url: string;
  category_id: string;
}

const VideoPlayer = ({ title, video_url, category_id }: VideoProps) => {
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
    <div className="relative">
      {/* Video container taking full width */}
      <div className="w-full">
        <video controls className="w-full">
          <source src={video_url} type="video/mp4" />
        </video>
      </div>
      
      {/* Overlay container for category name */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/50 px-6 py-3 rounded-lg">
          <span className="text-white text-3xl font-bold">
            {category?.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
