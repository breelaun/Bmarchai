import React from 'react';

interface VideoProps {
  videoUrl: string;
  category: string;
}

const VideoPlayer: React.FC<VideoProps> = ({ videoUrl, category }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="w-3/4">
        <video controls>
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="w-1/4 flex items-center justify-center">
        <span className="text-white rotate-90">{category}</span>
      </div>
    </div>
  );
};

const IndexPage: React.FC = () => {
  const videos: VideoProps[] = [
    {
      videoUrl: 'path/to/avishai-cohen-trio.mp4',
      category: 'Piano'
    },
    {
      videoUrl: 'path/to/sandra-nkake.mp4',
      category: 'Ambient'
    },
    {
      videoUrl: 'path/to/charles-lloyd-jason-moran-eric-harland.mp4',
      category: 'Jazz'
    }
  ];

  return (
    <div className="container mx-auto py-8">
      {videos.map((video, index) => (
        <div key={index} className="mb-8">
          <VideoPlayer videoUrl={video.videoUrl} category={video.category} />
        </div>
      ))}
    </div>
  );
};

export default IndexPage;
