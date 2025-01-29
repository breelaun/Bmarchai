import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CrosshairProps } from './types';

export const SqeresCrosshair: React.FC<CrosshairProps> = ({ 
  color = '#ffffff',
  containerRef 
}) => {
  const crosshairRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef?.current || !crosshairRef.current) return;

    const container = containerRef.current;
    const crosshair = crosshairRef.current;

    const updatePosition = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(crosshair, {
        duration: 0.1,
        x,
        y,
        ease: "power3.out"
      });
    };

    container.addEventListener('mousemove', updatePosition);

    return () => {
      container.removeEventListener('mousemove', updatePosition);
    };
  }, [containerRef]);

  return (
    <div 
      ref={crosshairRef}
      className="absolute pointer-events-none"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <svg width="40" height="40" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1" fill="none" />
        <line x1="20" y1="8" x2="20" y2="32" stroke={color} strokeWidth="1" />
        <line x1="8" y1="20" x2="32" y2="20" stroke={color} strokeWidth="1" />
      </svg>
    </div>
  );
};

export default SqeresCrosshair;
