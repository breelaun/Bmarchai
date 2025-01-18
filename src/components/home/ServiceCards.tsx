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

interface Ball {
  id: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
}

const ServiceCards = () => {
  const [speed, setSpeed] = useState(9);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [balls, setBalls] = useState<Ball[]>([]);
  const [releaseBalls, setReleaseBalls] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const ballIdCounter = useRef(0);
  
  const audioRef = useRef(new Audio('/audio/helicopter.mp3'));
  
  useEffect(() => {
    const audio = audioRef.current;
    
    const handleEnded = () => {
      if (soundEnabled) {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      }
    };

    audio.addEventListener('ended', handleEnded);
    audio.loop = true;
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [soundEnabled]);

  // Fixed volume handling
  useEffect(() => {
    const audio = audioRef.current;
    
    const updateAudio = () => {
      // Clamp volume between 0 and 1
      const baseVolume = Math.min(1.0, Math.max(0, speed / 200));
      audio.volume = baseVolume;
      
      const playbackRate = speed <= 100 
        ? 0.5 + (speed / 100) * 0.5
        : 1.0 + ((speed - 100) / 900) * 4;
      audio.playbackRate = Math.min(5.0, Math.max(0.5, playbackRate));
    };

    if (speed > 0 && soundEnabled) {
      updateAudio();
      if (audio.paused) {
        audio.play().catch(console.error);
      }
    } else {
      audio.pause();
    }
  }, [speed, soundEnabled]);

  // Ball physics with card collisions
  useEffect(() => {
    if (balls.length === 0) return;

    let animationFrameId: number;
    const gravity = releaseBalls ? 0.5 : 0;
    const bounce = 0.8;
    const friction = 0.99;

    const checkCardCollision = (ball: Ball) => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const cardCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        // Calculate rotation based on card position
        const angle = (index / services.length) * 2 * Math.PI + (Date.now() / (20000 / speed));
        
        // Simple collision check with cards
        const dx = ball.x - cardCenter.x;
        const dy = ball.y - cardCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + Math.max(rect.width, rect.height) / 2) {
          // Calculate bounce direction based on card rotation
          const bounceAngle = Math.atan2(dy, dx) + angle;
          const bounceSpeed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy) * bounce;
          
          ball.vx = Math.cos(bounceAngle) * bounceSpeed * 1.5;
          ball.vy = Math.sin(bounceAngle) * bounceSpeed * 1.5;
        }
      });
    };

    const animate = () => {
      setBalls(currentBalls => {
        return currentBalls.map(ball => {
          let newVx = ball.vx * friction;
          let newVy = ball.vy * friction + gravity;
          let newX = ball.x + newVx;
          let newY = ball.y + newVy;

          // Check collisions with cards
          const newBall = { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
          checkCardCollision(newBall);

          // Bounce off container walls
          const container = containerRef.current?.getBoundingClientRect();
          if (container) {
            if (newX - ball.radius < 0) {
              newX = ball.radius;
              newVx = -newVx * bounce;
            } else if (newX + ball.radius > container.width) {
              newX = container.width - ball.radius;
              newVx = -newVx * bounce;
            }

            if (!releaseBalls) {
              if (newY - ball.radius < 0) {
                newY = ball.radius;
                newVy = -newVy * bounce;
              } else if (newY + ball.radius > container.height) {
                newY = container.height - ball.radius;
                newVy = -newVy * bounce;
              }
            } else if (newY - ball.radius > window.innerHeight) {
              return null;
            }
          }

          return { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
        }).filter((ball): ball is Ball => ball !== null);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [balls, releaseBalls, speed]);

  const addBall = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const radius = 20; // Increased ball size
    const newBall: Ball = {
      id: ballIdCounter.current++,
      x: container.width / 2,
      y: container.height / 2,
      z: 0,
      vx: (Math.random() - 0.5) * 15,
      vy: (Math.random() - 0.5) * 15,
      vz: 0,
      radius
    };
    setBalls(current => [...current, newBall]);
  };

  const handleRelease = () => {
    setReleaseBalls(true);
  };

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

  return (
    <div className="flex flex-col items-center" ref={containerRef}>
      <div className="wrapper h-[300px] sm:h-[400px] md:h-[500px] mt-2 sm:mt-3 md:mt-4 mb-6 relative">
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
              ref={el => {
                if (el) cardsRef.current[index] = el as HTMLDivElement;
              }}
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
        
        {/* Chrome Balls */}
        {balls.map(ball => (
          <div
            key={ball.id}
            className="absolute rounded-full"
            style={{
              width: ball.radius * 2,
              height: ball.radius * 2,
              left: ball.x - ball.radius,
              top: ball.y - ball.radius,
              background: 'linear-gradient(135deg, #ffffff 0%, #b7b7b7 50%, #ffffff 100%)',
              boxShadow: '0 0 15px rgba(0,0,0,0.3)',
              transform: 'translateZ(0)',
            }}
          />
        ))}
      </div>
      
      <div className="w-full max-w-md mb-12 px-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            <button
              onClick={addBall}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Add Ball
            </button>
            <button
              onClick={handleRelease}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Release
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium">Speed: {speed}%</span>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={soundEnabled ? "Disable sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          value={speed}
          onChange={e => setSpeed(parseInt(e.target.value))}
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
