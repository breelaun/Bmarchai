import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CrosshairProps } from './types';

export const SqeresCrosshair: React.FC<CrosshairProps> = ({
  color = 'white',
  containerRef = null,
}) => {
  const crosshairRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef?.current;
    const crosshair = crosshairRef.current;
    
    if (!container || !crosshair) return;

    const updateCrosshair = (e: MouseEvent) => {
      gsap.to(crosshair, {
        duration: 0.1,
        x: e.clientX,
        y: e.clientY,
        ease: 'power2.out'
      });
    };

    container.addEventListener('mousemove', updateCrosshair);

    return () => {
      container.removeEventListener('mousemove', updateCrosshair);
    };
  }, [containerRef]);

  return (
    <div
      ref={crosshairRef}
      className="fixed pointer-events-none z-50"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <div className="relative">
        <div
          className="absolute w-6 h-px"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute h-6 w-px"
          style={{ backgroundColor: color }}
        />
        <div
          className="absolute w-2 h-2 rounded-full -mt-1 -ml-1"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};

export default SqeresCrosshair;