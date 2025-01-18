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
  const [speed, setSpeed] = useState(0); // 0 is stopped, negative is left, positive is right
  const innerRef = useRef(null);

  // Convert speed value (-100 to 100) to animation duration and direction
  const getAnimationStyle = () => {
    if (speed === 0) {
      return {
        animation: 'none',
        transform: innerRef.current?.style.transform || 'perspective(var(--perspective)) rotateX(var(--rotateX)) rotateY(0)'
      };
    }

    const duration = Math.abs(20 / (speed / 25)); // Converts speed to duration (faster speed = lower duration)
    const direction = speed < 0 ? 'reverse' : 'normal';
    
    return {
      animation: `rotating ${duration}s linear infinite`,
      animationDirection: direction
    };
  };

  const handleSliderChange = (e) => {
    const newSpeed = parseInt(e.target.value);
    setSpeed(newSpeed);
  };

  // Format speed label
  const getSpeedLabel = () => {
    if (speed === 0) return "Stopped";
    const direction = speed < 0 ? "Left" : "Right";
    const magnitude = Math.abs(speed);
    return `${direction} ${magnitude}%`;
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
        <div className="mb-2 text-center font-medium">{getSpeedLabel()}</div>
        <input
          type="range"
          min="-100"
          max="100"
          value={speed}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm mt-1">
          <span>Fast Left</span>
          <span>Stop</span>
          <span>Fast Right</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCards;
