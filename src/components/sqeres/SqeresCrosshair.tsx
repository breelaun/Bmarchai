import React, { useEffect, useState } from 'react';

interface SqeresCrosshairProps {
  containerRef: React.RefObject<HTMLDivElement>;
  color: string;
}

export const SqeresCrosshair: React.FC<SqeresCrosshairProps> = ({ containerRef, color }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [containerRef]);

  return (
    <div 
      className="pointer-events-none absolute"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="relative">
        <div 
          className="absolute w-8 h-px"
          style={{ backgroundColor: color }}
        />
        <div 
          className="absolute h-8 w-px"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};