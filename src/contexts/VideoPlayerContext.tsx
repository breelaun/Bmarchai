import React, { createContext, useContext, useState } from 'react';

interface VideoState {
  activeVideo: { url: string; title: string } | null;
  isPlaying: boolean;
  isMuted: boolean;
  setActiveVideo: (video: { url: string; title: string } | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
}

const VideoContext = createContext<VideoState | undefined>(undefined);

export const VideoProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeVideo, setActiveVideo] = useState<{ url: string; title: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <VideoContext.Provider
      value={{
        activeVideo,
        isPlaying,
        isMuted,
        setActiveVideo,
        setIsPlaying,
        setIsMuted
      }}
    >
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