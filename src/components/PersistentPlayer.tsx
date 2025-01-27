import React, { useState } from 'react';
import { X, Minimize2, Maximize2, Play, Pause } from 'lucide-react';

const PersistentPlayer = ({ videoUrl, title, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div 
      className={`fixed z-50 bg-black transition-all duration-300 ${
        isMinimized 
          ? 'bottom-4 right-4 w-64 h-36' 
          : 'bottom-8 right-8 w-96 h-56'
      }`}
    >
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        {isMinimized ? (
          <Maximize2 
            className="w-4 h-4 text-white cursor-pointer hover:text-gray-300"
            onClick={() => setIsMinimized(false)}
          />
        ) : (
          <Minimize2 
            className="w-4 h-4 text-white cursor-pointer hover:text-gray-300"
            onClick={() => setIsMinimized(true)}
          />
        )}
        <X 
          className="w-4 h-4 text-white cursor-pointer hover:text-gray-300"
          onClick={onClose}
        />
      </div>
      
      {/* Video overlay for play/pause when minimized */}
      {isMinimized && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </div>
      )}

      <iframe
        src={`${videoUrl}${isPlaying ? '' : '?pause=1'}`}
        className="w-full h-full"
        allowFullScreen
        title={title}
      />
    </div>
  );
};

export default PersistentPlayer;
