import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const innerRef = useRef(null);
  const audioRef = useRef(new Audio('/helicopter.mp3')); // Make sure to add this audio file to your public folder

  // Setup audio
  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    
    // Cleanup
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // Handle audio playback and speed
  useEffect(() => {
    const audio = audioRef.current;
    
    if (speed > 0) {
      if (audio.paused) {
        audio.play().catch(err => console.log('Audio playback failed:', err));
      }
      // Adjust playback rate based on speed
      // Map 0-200 speed range to 0.5-2.5 playback rate
      const playbackRate = 0.5 + (speed / 100) * 1;
      audio.playbackRate = Math.min(2.5, Math.max(0.5, playbackRate));
      audio.volume = Math.min(1, speed / 100); // Increase volume with speed
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [speed]);

  // Convert speed value (0 to 200) to animation duration
  const getAnimationStyle = () => {
    if (speed === 0) {
      return {
        animation: 'none',
        transform: innerRef.current?.style.transform || 'perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0)'
      };
    }

    const duration = 20 / (speed / 50); // Converts speed to duration (faster speed = lower duration)
    
    return {
      animation: `rotating ${duration}s linear infinite`
    };
  };

  const handleSliderChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
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
      
      {/* Speed Control Slider */}
      <div className="w-full max-w-md mb-12 px-4">
        <div className="mb-2 text-center font-medium">Speed: {speed}%</div>
        <input
          type="range"
          min="0"
          max="200"
          value={speed}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>Stop</span>
          <span>Max Speed</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;
