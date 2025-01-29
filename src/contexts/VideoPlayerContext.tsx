import React, { createContext, useContext, useState } from 'react';

interface VideoContextType {
  activeVideo: { url: string; title: string } | null;
  setActiveVideo: (video: { url: string; title: string } | null) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);

  return (
    <VideoContext.Provider value={{ activeVideo, setActiveVideo }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};
