// ServiceCards.tsx
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
  const innerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentVelocity, setCurrentVelocity] = useState(1);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const velocityRef = useRef(1);
  const frameRef = useRef(null);

  const updateRotation = () => {
    if (!innerRef.current) return;
    
    // Apply friction to gradually slow down
    velocityRef.current *= 0.99;
    
    // Set a minimum velocity to eventually stop
    if (Math.abs(velocityRef.current - 1) < 0.01) {
      velocityRef.current = 1;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      return;
    }

    innerRef.current.style.animationDuration = `${20 / velocityRef.current}s`;
    frameRef.current = requestAnimationFrame(updateRotation);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setLastX(e.touches[0].clientX);
    setLastTime(Date.now());
    
    // Pause the CSS animation while dragging
    if (innerRef.current) {
      const rotation = getComputedStyle(innerRef.current).getPropertyValue('transform');
      innerRef.current.style.animation = 'none';
      innerRef.current.style.transform = rotation;
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentTime = Date.now();
    const deltaX = currentX - lastX;
    const deltaTime = currentTime - lastTime;
    
    // Calculate instantaneous velocity
    const instantVelocity = Math.abs(deltaX / deltaTime) * 0.1;
    
    // Update velocity based on movement direction
    const newVelocity = 1 + (deltaX > 0 ? instantVelocity : -instantVelocity);
    velocityRef.current = newVelocity;
    setCurrentVelocity(newVelocity);

    // Update last positions
    setLastX(currentX);
    setLastTime(currentTime);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Resume the CSS animation with current velocity
    if (innerRef.current) {
      innerRef.current.style.animation = 'rotating 20s linear infinite';
      innerRef.current.style.animationDuration = `${20 / currentVelocity}s`;
    }
    
    // Start the momentum effect
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateRotation);
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div className="wrapper h-[300px] sm:h-[400px] md:h-[500px] mt-2 sm:mt-3 md:mt-4 mb-12 sm:mb-16 md:mb-20">
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
        } as React.CSSProperties}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
  );
};

export default ServiceCards;
