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

interface CustomCSSProperties extends React.CSSProperties {
  '--quantity'?: number;
  '--w'?: string;
  '--h'?: string;
  '--translateZ'?: string;
  '--rotateX'?: string;
  '--perspective'?: string;
  '--index'?: number;
  '--color-card'?: string;
}

const ServiceCards = () => {
  const [speed, setSpeed] = useState(9);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const innerRef = useRef(null);
  
  const audioRef1 = useRef(new Audio('/audio/helicopter.mp3'));
  const audioRef2 = useRef(new Audio('/audio/helicopter.mp3'));
  const timeoutRef = useRef(null);

  useEffect(() => {
    const audio1 = audioRef1.current;
    const audio2 = audioRef2.current;

    const setupAudioLoop = (audio, otherAudio, isFirstClip) => {
      audio.addEventListener('ended', () => {
        if (soundEnabled) {
          audio.currentTime = 0;
          audio.play().catch(console.error);

          const normalizedRate = audio.playbackRate;
          const startDelay = (isFirstClip ? 15000 : -15000) / normalizedRate;

          if (otherAudio.paused) {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              if (soundEnabled) {
                otherAudio.currentTime = 0;
                otherAudio.play().catch(console.error);
              }
            }, Math.max(0, startDelay));
          }
        }
      });
    };

    setupAudioLoop(audio1, audio2, true);
    setupAudioLoop(audio2, audio1, false);

    const setupAudio = () => {
      if (!soundEnabled) {
        audio1.pause();
        audio2.pause();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        return;
      }

      const playbackRate = speed <= 100 
        ? 0.5 + (speed / 100) * 0.5
        : 1.0 + ((speed - 100) / 900) * 4;
      
      const normalizedRate = Math.min(5.0, Math.max(0.5, playbackRate));
      
      audio1.playbackRate = normalizedRate;
      audio2.playbackRate = normalizedRate;

      const secondClipStartTime = 15 / normalizedRate;

      if (audio1.paused) {
        audio1.currentTime = 0;
        audio1.play().catch(console.error);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          if (soundEnabled) {
            audio2.currentTime = 0;
            audio2.play().catch(console.error);
          }
        }, secondClipStartTime * 1000);
      }
    };

    setupAudio();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      audio1.pause();
      audio2.pause();
      audio1.currentTime = 0;
      audio2.currentTime = 0;
    };
  }, [speed, soundEnabled]);

  const getAnimationStyle = () => {
    if (speed === 0) {
      return {
        animation: 'none',
        transform: innerRef.current?.style.transform || 'perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0)'
      } as CustomCSSProperties;
    }
    const duration = 20 / Math.pow(speed / 50, 1.2);
    return {
      animation: `rotating ${duration}s linear infinite`
    } as CustomCSSProperties;
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
          } as CustomCSSProperties}
        >
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.link}
              className="card text-center"
              style={{ 
                '--index': index, 
                '--color-card': service.color 
              } as CustomCSSProperties}
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
