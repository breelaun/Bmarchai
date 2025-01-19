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
  vx: number;
  vy: number;
  radius: number;
  lastCardHit: number;
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
    audio.loop = true;
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    
    if (speed > 0 && soundEnabled) {
      audio.volume = Math.min(1.0, Math.max(0, speed / 150));
      audio.playbackRate = Math.min(5.0, Math.max(0.5, speed / 100));
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [speed, soundEnabled]);

  useEffect(() => {
    if (balls.length === 0) return;

    let animationFrameId: number;
    const gravity = releaseBalls ? 0.5 : 0;
    const bounce = 0.85;
    const friction = 0.98;
    const spinForce = speed / 50;

    const checkCardCollision = (ball: Ball) => {
      const currentTime = Date.now();
      if (!containerRef.current || currentTime - ball.lastCardHit < 100) return;

      const container = containerRef.current.getBoundingClientRect();
      const centerX = container.left + container.width / 2;
      const centerY = container.top + container.height / 2;
      const rotationAngle = (currentTime / (20000 / speed)) % (2 * Math.PI);

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        const cardAngle = (index / services.length) * 2 * Math.PI + rotationAngle;
        const radius = 200;
        
        const cardX = centerX + radius * Math.cos(cardAngle);
        const cardY = centerY + radius * Math.sin(cardAngle);
        
        const dx = ball.x - cardX;
        const dy = ball.y - cardY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + 50) {
          const cardVx = -Math.sin(cardAngle) * spinForce;
          const cardVy = Math.cos(cardAngle) * spinForce;
          
          ball.vx = (ball.vx * 0.2 + cardVx * 2.5) * bounce;
          ball.vy = (ball.vy * 0.2 + cardVy * 2.5) * bounce;
          
          ball.vx += (Math.random() - 0.5) * spinForce;
          ball.vy += (Math.random() - 0.5) * spinForce;
          
          const toCenterX = centerX - ball.x;
          const toCenterY = centerY - ball.y;
          const toCenterDist = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
          
          if (!releaseBalls) {
            ball.vx += (toCenterX / toCenterDist) * spinForce * 0.5;
            ball.vy += (toCenterY / toCenterDist) * spinForce * 0.5;
          }
          
          ball.lastCardHit = currentTime;
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

          const newBall = { ...ball, x: newX, y: newY, vx: newVx, vy: newVy };
          
          if (!releaseBalls) {
            checkCardCollision(newBall);
          }

          const container = containerRef.current?.getBoundingClientRect();
          if (container) {
            if (newX - ball.radius < 0) {
              newX = ball.radius;
              newVx = Math.abs(newVx) * bounce;
            } else if (newX + ball.radius > container.width) {
              newX = container.width - ball.radius;
              newVx = -Math.abs(newVx) * bounce;
            }

            if (!releaseBalls) {
              if (newY - ball.radius < 0) {
                newY = ball.radius;
                newVy = Math.abs(newVy) * bounce;
              } else if (newY + ball.radius > container.height) {
                newY = container.height - ball.radius;
                newVy = -Math.abs(newVy) * bounce;
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
    const radius = 25;
    const newBall: Ball = {
      id: ballIdCounter.current++,
      x: container.width / 2,
      y: container.height / 2,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      radius,
      lastCardHit: 0
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
        
        {balls.map(ball => (
          <div
            key={ball.id}
            className="absolute rounded-full"
            style={{
              width: ball.radius * 2,
              height: ball.radius * 2,
              left: ball.x - ball.radius,
              top: ball.y - ball.radius,
              background: `radial-gradient(circle at 30% 30%, 
                rgba(255,255,255,0.8) 0%, 
                rgba(255,255,255,0.2) 50%, 
                rgba(183,183,183,0.8) 100%)`,
              boxShadow: `
                inset -4px -4px 8px rgba(0,0,0,0.2),
                inset 4px 4px 8px rgba(255,255,255,0.8),
                0 0 20px rgba(0,0,0,0.3)
              `,
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
