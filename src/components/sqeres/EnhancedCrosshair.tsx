import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CrosshairProps {
  color?: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const EnhancedCrosshair: React.FC<CrosshairProps> = ({ 
  color = '#ffffff',
  containerRef 
}) => {
  const lineHorizontalRef = useRef<HTMLDivElement>(null);
  const lineVerticalRef = useRef<HTMLDivElement>(null);
  const filterXRef = useRef<SVGFETurbulenceElement>(null);
  const filterYRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    if (!containerRef?.current) return;

    const container = containerRef.current;
    let mouse = { x: 0, y: 0 };

    const updatePosition = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;

      gsap.to(lineVerticalRef.current, {
        duration: 0.15,
        x: mouse.x,
        ease: "power2.out"
      });
      gsap.to(lineHorizontalRef.current, {
        duration: 0.15,
        y: mouse.y,
        ease: "power2.out"
      });
    };

    const handleMouseEnter = () => {
      gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
        duration: 0.3,
        opacity: 1,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to([lineHorizontalRef.current, lineVerticalRef.current], {
        duration: 0.3,
        opacity: 0,
        ease: "power2.out"
      });
    };

    // Add blur effect on targeting
    const handleMouseDown = () => {
      if (filterXRef.current && filterYRef.current) {
        gsap.to([filterXRef.current, filterYRef.current], {
          duration: 0.3,
          attr: { baseFrequency: 0.02 },
          ease: "power2.out"
        });
      }
    };

    const handleMouseUp = () => {
      if (filterXRef.current && filterYRef.current) {
        gsap.to([filterXRef.current, filterYRef.current], {
          duration: 0.3,
          attr: { baseFrequency: 0 },
          ease: "power2.out"
        });
      }
    };

    container.addEventListener('mousemove', updatePosition);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('mousemove', updatePosition);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence
              ref={filterXRef}
              type="fractalNoise"
              baseFrequency="0"
              numOctaves="1"
            />
            <feDisplacementMap in="SourceGraphic" scale="20" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence
              ref={filterYRef}
              type="fractalNoise"
              baseFrequency="0"
              numOctaves="1"
            />
            <feDisplacementMap in="SourceGraphic" scale="20" />
          </filter>
        </defs>
      </svg>
      <div
        ref={lineHorizontalRef}
        className="absolute w-full h-px opacity-0"
        style={{
          background: color,
          filter: 'url(#filter-noise-x)',
          transform: 'translateY(-50%)'
        }}
      />
      <div
        ref={lineVerticalRef}
        className="absolute h-full w-px opacity-0"
        style={{
          background: color,
          filter: 'url(#filter-noise-y)',
          transform: 'translateX(-50%)'
        }}
      />
    </div>
  );
};
