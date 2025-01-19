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
  
  const audioRef1 = useRef(new Audio('/audio/helicopter.mp3'));
  const audioRef2 = useRef(new Audio('/audio/helicopter.mp3'));
  const activeAudioRef = useRef(1);
  const fadeIntervalRef = useRef(null);

  // Setup audio players
  useEffect(() => {
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;

    // Start crossfade earlier to prevent gaps
    const handleAudioEnd = (audioNumber) => {
      if (!soundEnabled) return;
      
      const startNextAudio = (nextAudio, currentAudio) => {
        nextAudio.currentTime = 0;
        nextAudio.volume = 0;
        nextAudio.play().catch(console.error);
        fadeAudio(nextAudio, currentAudio);
      };

      if (audioNumber === 1) {
        startNextAudio(audio2, audio1);
        activeAudioRef.current = 2;
      } else {
        startNextAudio(audio1, audio2);
        activeAudioRef.current = 1;
      }
    };

    const setupAudioListener = (audio, audioNumber) => {
      audio.addEventListener('timeupdate', () => {
        // Start transition when 0.5 seconds remain
        if (audio.currentTime >= audio.duration - 0.5 && 
            activeAudioRef.current === audioNumber) {
          handleAudioEnd(audioNumber);
        }
      });
    };

    setupAudioListener(audio1, 1);
    setupAudioListener(audio2, 2);

    return () => {
      audio1.pause();
      audio2.pause();
      audio1.currentTime = 0;
      audio2.currentTime = 0;
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [soundEnabled]);

  // Enhanced fade audio function
  const fadeAudio = (inAudio, outAudio) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }

    const fadePoints = 40; // Increased for smoother transition
    const fadeInterval = 25; // Slower fade for smoother transition
    let currentPoint = 0;

    // Calculate base volume based on speed
    const baseVolume = Math.min(1.5, speed / 100); // Increased maximum volume

    fadeIntervalRef.current = setInterval(() => {
      if (currentPoint < fadePoints) {
        currentPoint++;
        const fadeRatio = currentPoint / fadePoints;
        inAudio.volume = baseVolume * fadeRatio;
        outAudio.volume = baseVolume * (1 - fadeRatio);
      } else {
        clearInterval(fadeIntervalRef.current);
        outAudio.pause();
      }
    }, fadeInterval);
  };

  // Enhanced speed effect on audio
  useEffect(() => {
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;
    
    const updateAudioSpeed = (audio) => {
      // Enhanced speed scaling
      const playbackRate = speed <= 100 
        ? 0.5 + (speed / 100) * 0.5  // Slower speeds: 0.5x to 1.0x
        : 1.0 + ((speed - 100) / 900) * 4;  // Faster speeds: 1.0x to 5.0x
      audio.playbackRate = Math.min(5.0, Math.max(0.5, playbackRate));
    };

    if (speed > 0 && soundEnabled) {
      // Calculate volume based on speed
      const baseVolume = Math.min(1.5, speed / 100);
      
      if (audio1.paused && audio2.paused) {
        audio1.volume = baseVolume;
        audio1.play().catch(console.error);
        activeAudioRef.current = 1;
      }
      
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
          max="1000"
          value={speed}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>Stop</span>
          <span>Max Speed (1000%)</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;
