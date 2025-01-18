import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';

// Services array remains the same...
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
  const centerPoint = useRef({ x: 0, y: 0 });
  
  const audioRef = useRef(new Audio('/audio/helicopter.mp3'));
  
  // Audio setup remains similar but with volume adjustments...
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
      audio.volume = Math.min(1.0, Math.max(0, speed / 150)); // Adjusted volume scaling
      audio.playbackRate = Math.min(5.0, Math.max(0.5, speed / 100));
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [speed, soundEnabled]);

  // Updated physics with roulette-style behavior
  useEffect(() => {
    if (balls.length === 0) return;

    let animationFrameId: number;
    const bounce = 0.85; // Increased bounce factor
    const friction = 0.98; // Reduced friction
    const spinForce = speed / 50; // Force from spinning cards

    // Update center point on every frame
    const updateCenterPoint = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        centerPoint.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      }
    };

    const checkCardCollision = (ball: Ball) => {
      const currentTime = Date.now();
      const rotationAngle = (currentTime / (20000 / speed)) % (2 * Math.PI);
      
      cardsRef.current.forEach((card, index) => {
        if (!card || currentTime - ball.lastCardHit < 100) return; // Prevent multiple hits too quickly
        
        const cardAngle = (index / services.length) * 2 * Math.PI + rotationAngle;
        const radius = 200; // Approximate radius of card circle
        
        // Calculate card position on the circle
        const cardX = centerPoint.current.x + radius * Math.cos(cardAngle);
        const cardY = centerPoint.current.y + radius * Math.sin(cardAngle);
        
        // Check distance between ball and card
        const dx = ball.x - cardX;
        const dy = ball.y - cardY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < ball.radius + 50) { // Adjusted collision radius
          // Calculate card's velocity at point of impact
          const cardVx = -Math.sin(cardAngle) * spinForce;
          const cardVy = Math.cos(cardAngle) * spinForce;
          
          // Transfer card momentum to ball
          ball.vx = (ball.vx * 0.2 + cardVx * 2.5) * bounce;
          ball.vy = (ball.vy * 0.2 + cardVy * 2.5) * bounce;
          
          // Add some random variation
          ball.vx += (Math.random() - 0.5) * spinForce;
          ball.vy += (Math.random() - 0.5) * spinForce;
          
          // Add slight inward force to keep balls in play
          const toCenterX = centerPoint.current.x - ball.x;
          const toCenterY = centerPoint.current.y - ball.y;
          const toCenterDist = Math.sqrt(toCenterX * toCenterX + toCenterY * toCenterY);
          
          ball.vx += (toCenterX / toCenterDist) * spinForce * 0.5;
          ball.vy += (toCenterY / toCenterDist) * spinForce * 0.5;
          
          ball.lastCardHit = currentTime;
        }
      });
    };

    const animate = () => {
      updateCenterPoint();
      
      setBalls(currentBalls => {
        return currentBalls.map(ball => {
          // Apply velocity
          let newBall = { ...ball };
          newBall.x += ball.vx;
          newBall.y += ball.vy;
          
          // Check card collisions
          checkCardCollision(newBall);
          
          // Apply friction
          newBall.vx *= friction;
          newBall.vy *= friction;
          
          // Contain balls within the container
          const container = containerRef.current?.getBoundingClientRect();
          if (container) {
            const margin = 50; // Keep balls within visible area
            if (newBall.x < container.left + margin) {
              newBall.x = container.left + margin;
              newBall.vx = Math.abs(newBall.vx) * bounce;
            }
            if (newBall.x > container.right - margin) {
              newBall.x = container.right - margin;
              newBall.vx = -Math.abs(newBall.vx) * bounce;
            }
            if (newBall.y < container.top + margin) {
              newBall.y = container.top + margin;
              newBall.vy = Math.abs(newBall.vy) * bounce;
            }
            if (newBall.y > container.bottom - margin) {
              newBall.y = container.bottom - margin;
              newBall.vy = -Math.abs(newBall.vy) * bounce;
            }
          }
          
          return newBall;
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [balls, speed]);

  const addBall = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const radius = 25; // Larger balls
    const newBall: Ball = {
      id: ballIdCounter.current++,
      x: container.width / 2,
      y: container.height / 2,
      z: 0,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      vz: 0,
      radius,
      lastCardHit: 0
    };
    setBalls(current => [...current, newBall]);
  };

  // Rest of the component (render method, etc.) remains mostly the same...
  // Just update the ball styling:

  return (
    <div className="flex flex-col items-center" ref={containerRef}>
      {/* Previous wrapper and cards code remains the same */}
      
      {/* Updated ball rendering */}
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
      
      {/* Controls remain the same */}
    </div>
  );
};

export default ServiceCards;
