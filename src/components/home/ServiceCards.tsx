import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

const services = [
  { title: 'Online Coaching', link: '/coaching', color: '255, 195, 0' },
  { title: 'CRM Tools', link: '/crm', color: '44, 62, 80' },
  { title: 'Video Chat', link: '/video-chat', color: '255, 195, 0' },
  { title: 'Streaming', link: '/streaming', color: '44, 62, 80' },
  { title: 'Blogs', link: '/blogs', color: '255, 195, 0' },
  { title: 'Shops', link: '/shop', color: '44, 62, 80' },
  { title: 'Customizable Profile', link: '/profile', color: '255, 195, 0' },
  { title: 'Consulting', link: '/consulting', color: '44, 62, 80' }
];

const ServiceCards = () => {
  const [speed, setSpeed] = useState(9); // Starting at 9%
  const [soundEnabled, setSoundEnabled] = useState(false);
  const innerRef = useRef(null);
  const audioRef = useRef(new Audio('/audio/helicopter.mp3'));

  // Setup audio
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Handle audio playback and speed
  useEffect(() => {
    const audio = audioRef.current;
    
    if (speed > 0 && soundEnabled) {
      const playAudio = async () => {
        try {
          await audio.play();
          // Map 0-500 speed range to 0.5-3 playback rate
          // Slower at low speeds, much faster at high speeds
          const playbackRate = speed <= 100 
            ? 0.5 + (speed / 100) * 0.5  // 0.5 to 1.0 for 0-100%
            : 1.0 + ((speed - 100) / 400) * 2; // 1.0 to 3.0 for 100-500%
          
          audio.playbackRate = Math.min(3, Math.max(0.5, playbackRate));
          audio.volume = Math.min(1, speed / 200); // Full volume at 200%
        } catch (err) {
          console.log('Audio playback failed:', err);
        }
      };
      playAudio();
    } else {
      audio.pause();
    }
  }, [speed, soundEnabled]);

  // Convert speed value (0 to 500) to animation duration
  const getAnimationStyle = () => {
    if (speed === 0) {
      return {
        animation: 'none',
        transform: innerRef.current?.style.transform || 'perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0)'
      };
    }

    // Exponential speed increase for more dramatic fast speeds
    const duration = 20 / Math.pow(speed / 50, 1.2);
    
    return {
      animation: `rotating ${duration}s linear infinite`
    };
  };

  const handleSliderChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="wrapper h-[300px] sm:h-[400px] md:h-[500px] mt-2 sm:mt-3 md:mt-4 mb-6">
        <div 
          ref={innerRef}
          className="inner" 
          style={{ 
            '--quantity': services.length,
            '--w': '250px',
            '--h': '150px',
            '--translateZ': 'calc((var(--w) + var(--h)) + 0px)',
            '--rotateX': '-11deg',
            '--perspective': '1000px',
            ...getAnimationStyle()
          } as React.CSSProperties}
        >
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.link}
              className="card text-center"
              style={{ 
                '--index': index, 
                '--color-card': service.color 
              } as React.CSSProperties}
            >
              <div className="img flex items-center justify-center p-2">
                <h3 className="text-sm sm:text-base md:text-xl font-bold text-foreground">
                  {service.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Controls */}
      <div className="w-full max-w-md mb-12 px-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Speed: {speed}%</span>
          <button
            onClick={toggleSound}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          value={speed}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>Stop</span>
          <span>Max Speed (500%)</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;
