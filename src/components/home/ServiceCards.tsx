import React, { useState, useRef } from 'react';
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
  const [touchStartX, setTouchStartX] = useState(null);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const innerRef = useRef(null);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStartX) return;

    const touchEndX = e.touches[0].clientX;
    const difference = touchEndX - touchStartX;
    
    // Adjust speed based on swipe distance
    const newSpeed = Math.max(0.5, Math.min(3, 1 + difference / 200));
    setRotationSpeed(newSpeed);
    
    // Update the CSS animation
    if (innerRef.current) {
      innerRef.current.style.animationDuration = `${20 / newSpeed}s`;
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

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
          animationDuration: `${20 / rotationSpeed}s`
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
