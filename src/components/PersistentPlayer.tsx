import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Maximize2, Play, Pause, Volume2, VolumeX, GripVertical } from 'lucide-react';

const PersistentPlayer = ({ videoUrl, title, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [position, setPosition] = useState({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const iframeRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Initialize position if not set
    if (position.x === null || position.y === null) {
      setPosition({
        x: window.innerWidth - (isMinimized ? 280 : 420), // width + margin
        y: window.innerHeight - (isMinimized ? 160 : 240), // height + margin
      });
    }
  }, [isMinimized, position.x, position.y]);

  const handleDragStart = (e) => {
    if (e.target.closest('.controls')) return; // Don't start drag if clicking controls
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleDrag = (e) => {
    if (!isDragging) return;

    const width = isMinimized ? 256 : 384; // w-64 or w-96
    const height = isMinimized ? 144 : 224; // h-36 or h-56
    
    let newX = e.clientX - dragStartPos.current.x;
    let newY = e.clientY - dragStartPos.current.y;

    // Constrain to window bounds
    newX = Math.max(0, Math.min(window.innerWidth - width, newX));
    newY = Math.max(0, Math.min(window.innerHeight - height, newY));

    setPosition({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, isMinimized]);

  // Video control functions from previous version
  const sendMessage = (action) => {
    if (iframeRef.current) {
      try {
        const iframe = iframeRef.current;
        const target = iframe.contentWindow;
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

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    sendMessage(isPlaying ? 'pause' : 'play');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    sendMessage(isMuted ? 'unmute' : 'mute');
  };

  useEffect(() => {
    const handleMessage = (event) => {
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

  const getEmbedUrl = () => {
    let embedUrl = videoUrl;
    if (videoUrl.includes('youtube')) {
      embedUrl = `${videoUrl}?enablejsapi=1&origin=${window.location.origin}`;
    } else if (videoUrl.includes('vimeo')) {
      embedUrl = `${videoUrl}?api=1&player_id=vimeo_player`;
    }
    return embedUrl;
  };

  return (
    <div 
      ref={dragRef}
      className={`fixed z-50 bg-black transition-all duration-300 rounded-lg overflow-hidden shadow-lg ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${isMinimized ? 'w-64 h-36' : 'w-96 h-56'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onMouseDown={handleDragStart}
    >
      {/* Drag Handle */}
      <div className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-center z-30 bg-gradient-to-r from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4 text-white" />
      </div>

      {/* Control Bar */}
      <div className="controls absolute top-0 left-0 right-0 p-2 flex justify-between items-center bg-gradient-to-b from-black/70 to-transparent z-20">
        <div className="text-white text-sm truncate max-w-[70%] pl-6">
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
