import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, Play, Pause, Volume2, VolumeX } from 'lucide-react';

const PersistentPlayer = ({ videoUrl, title, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef(null);

  // Function to send messages to iframe
  const sendMessage = (action) => {
    if (iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        const target = iframe.contentWindow;
        // Handle different video platforms
        if (videoUrl.includes('youtube')) {
          target.postMessage({ event: action, func: action }, '*');
        } else if (videoUrl.includes('vimeo')) {
          target.postMessage({ method: action }, '*');
        }
      } catch (error) {
        console.error('Error sending message to iframe:', error);
      }
    }
  };

  // Handle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    sendMessage(isPlaying ? 'pause' : 'play');
  };

  // Handle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    sendMessage(isMuted ? 'unmute' : 'mute');
  };

  // Add message listener for iframe responses
  useEffect(() => {
    const handleMessage = (event) => {
      // Handle messages from video platforms if needed
      if (event.data && event.data.event) {
        switch (event.data.event) {
          case 'paused':
            setIsPlaying(false);
            break;
          case 'playing':
            setIsPlaying(true);
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Modify URL based on video platform
  const getEmbedUrl = () => {
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube')) {
      // Add YouTube API parameters
      embedUrl = `${videoUrl}?enablejsapi=1&origin=${window.location.origin}`;
    } else if (videoUrl.includes('vimeo')) {
      // Add Vimeo API parameters
      embedUrl = `${videoUrl}?api=1&player_id=vimeo_player`;
    }
    return embedUrl;
  };

  return (
    <div 
      className={`fixed z-50 bg-black transition-all duration-300 rounded-lg overflow-hidden shadow-lg ${
        isMinimized 
          ? 'bottom-4 right-4 w-64 h-36' 
          : 'bottom-8 right-8 w-96 h-56'
      }`}
    >
      {/* Control Bar */}
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent z-20">
        <div className="text-white text-sm truncate max-w-[70%]">
          {title}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={toggleMute}
            className="p-1 hover:bg-white/20 rounded"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-white" />
            ) : (
              <Volume2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4 text-white" />
            ) : (
              <Minimize2 className="w-4 h-4 text-white" />
            )}
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
      
      {/* Play/Pause Overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-black/40 z-10 transition-opacity duration-200 ${
          isMinimized || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Pause className="w-8 h-8 text-white" />
        ) : (
          <Play className="w-8 h-8 text-white" />
        )}
      </div>

      <iframe
        ref={iframeRef}
        src={getEmbedUrl()}
        className="w-full h-full"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={title}
      />
    </div>
  );
};

export default PersistentPlayer;
