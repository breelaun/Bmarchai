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
  const [speed, setSpeed] = useState(9);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const innerRef = useRef(null);
  
  // Create two audio players for crossfade
  const audioRef1 = useRef(new Audio('/audio/helicopter.mp3'));
  const audioRef2 = useRef(new Audio('/audio/helicopter.mp3'));
  const activeAudioRef = useRef(1); // Track which audio player is currently active

  // Setup audio players
  useEffect(() => {
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;

    // Set up event listeners for seamless loop
    const handleAudioEnd = (audioNumber) => {
      if (!soundEnabled) return;
      
      if (audioNumber === 1) {
        // Start audio2 and fade it in
        audio2.currentTime = 0;
        audio2.volume = 0;
        audio2.play();
        fadeAudio(audio2, 'in');
        // Fade out audio1
        fadeAudio(audio1, 'out');
        activeAudioRef.current = 2;
      } else {
        // Start audio1 and fade it in
        audio1.currentTime = 0;
        audio1.volume = 0;
        audio1.play();
        fadeAudio(audio1, 'in');
        // Fade out audio2
        fadeAudio(audio2, 'out');
        activeAudioRef.current = 1;
      }
    };

    audio1.addEventListener('timeupdate', () => {
      // Start transition slightly before the end
      if (audio1.currentTime >= audio1.duration - 0.2 && activeAudioRef.current === 1) {
        handleAudioEnd(1);
      }
    });

    audio2.addEventListener('timeupdate', () => {
      if (audio2.currentTime >= audio2.duration - 0.2 && activeAudioRef.current === 2) {
        handleAudioEnd(2);
      }
    });

    return () => {
      audio1.pause();
      audio2.pause();
      audio1.currentTime = 0;
      audio2.currentTime = 0;
    };
  }, [soundEnabled]);

  // Fade audio helper function
  const fadeAudio = (audioElement, direction) => {
    const fadePoints = 20;
    const fadeInterval = 10; // milliseconds
    let currentPoint = direction === 'in' ? 0 : fadePoints;

    const fade = setInterval(() => {
      if (direction === 'in' && currentPoint < fadePoints) {
        currentPoint++;
        audioElement.volume = Math.min(1, speed / 200) * (currentPoint / fadePoints);
      } else if (direction === 'out' && currentPoint > 0) {
        currentPoint--;
        audioElement.volume = Math.min(1, speed / 200) * (currentPoint / fadePoints);
      } else {
        clearInterval(fade);
        if (direction === 'out') {
          audioElement.pause();
        }
      }
    }, fadeInterval);
  };

  // Handle audio playback and speed
  useEffect(() => {
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;
    
    const updateAudioSpeed = (audio) => {
      const playbackRate = speed <= 100 
        ? 0.5 + (speed / 100) * 0.5
        : 1.0 + ((speed - 100) / 400) * 2;
      audio.playbackRate = Math.min(3, Math.max(0.5, playbackRate));
    };

    if (speed > 0 && soundEnabled) {
      // Start initial playback if needed
      if (audio1.paused && audio2.paused) {
        audio1.volume = Math.min(1, speed / 200);
        audio1.play().catch(console.error);
        activeAudioRef.current = 1;
      }
      
      // Update speed for both audio players
      updateAudioSpeed(audio1);
      updateAudioSpeed(audio2);
    } else {
      audio1.pause();
      audio2.pause();
    }
  }, [speed, soundEnabled]);

  const getAnimationStyle = () => {
    if (speed === 0) {
      return {
        animation: 'none',
        transform: innerRef.current?.style.transform || 'perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0)'
      };
    }
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

  // Rest of the component remains the same
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
