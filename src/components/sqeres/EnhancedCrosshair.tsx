import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface CrosshairProps {
  color?: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const SqeresCrosshair: React.FC<CrosshairProps> = ({ 
  color = '#ffffff',
  containerRef 
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const lineHorizontalRef = useRef<HTMLDivElement>(null);
  const lineVerticalRef = useRef<HTMLDivElement>(null);
  const filterXRef = useRef<SVGFETurbulenceElement>(null);
  const filterYRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    if (!containerRef?.current) return;

    const container = containerRef.current;
    let mouse = { x: 0, y: 0 };
    
    const handleMouseMove = (ev: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      mouse = {
        x: ev.clientX - bounds.left,
        y: ev.clientY - bounds.top
      };

      // Handle line visibility based on mouse position
      if (
        ev.clientX < bounds.left ||
        ev.clientX > bounds.right ||
        ev.clientY < bounds.top ||
        ev.clientY > bounds.bottom
      ) {
        gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 0 });
      } else {
        gsap.to([lineHorizontalRef.current, lineVerticalRef.current], { opacity: 1 });
      }

      // Update line positions
      if (lineHorizontalRef.current && lineVerticalRef.current) {
        gsap.to(lineVerticalRef.current, {
          duration: 0.15,
          x: mouse.x,
          ease: "power3.out"
        });
        gsap.to(lineHorizontalRef.current, {
          duration: 0.15,
          y: mouse.y,
          ease: "power3.out"
        });
      }
    };

    // Initialize line effects
    const primitiveValues = { turbulence: 0 };
    const tl = gsap.timeline({
      paused: true,
      onStart: () => {
        if (lineHorizontalRef.current && lineVerticalRef.current) {
          lineHorizontalRef.current.style.filter = `url(#filter-noise-x)`;
          lineVerticalRef.current.style.filter = `url(#filter-noise-y)`;
        }
      },
      onUpdate: () => {
        if (filterXRef.current && filterYRef.current) {
          filterXRef.current.setAttribute('baseFrequency', primitiveValues.turbulence.toString());
          filterYRef.current.setAttribute('baseFrequency', primitiveValues.turbulence.toString());
        }
      },
      onComplete: () => {
        if (lineHorizontalRef.current && lineVerticalRef.current) {
          lineHorizontalRef.current.style.filter = 'none';
          lineVerticalRef.current.style.filter = 'none';
        }
      }
    }).to(primitiveValues, {
      duration: 0.5,
      ease: 'power1',
      startAt: { turbulence: 0.8 },
      turbulence: 0
    });

    // Handle hover effects on interactive elements
    const handleElementEnter = () => tl.restart();
    const handleElementLeave = () => tl.progress(1).kill();

    // Add effects to interactive elements
    const interactiveElements = container.querySelectorAll('button, a, [role="button"]');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', handleElementEnter);
      element.addEventListener('mouseleave', handleElementLeave);
    });

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleElementEnter);
        element.removeEventListener('mouseleave', handleElementLeave);
      });
    };
  }, [containerRef]);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
      }}
    >
      <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
        <defs>
          <filter id="filter-noise-x">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.000001" 
              numOctaves="1" 
              ref={filterXRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
          <filter id="filter-noise-y">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.000001" 
              numOctaves="1" 
              ref={filterYRef}
            />
            <feDisplacementMap in="SourceGraphic" scale="40" />
          </filter>
        </defs>
      </svg>
      <div
        ref={lineHorizontalRef}
        style={{
          position: 'absolute',
          width: '100%',
          height: '1px',
          background: color,
          pointerEvents: 'none',
          opacity: 0,
        }}
      />
      <div
        ref={lineVerticalRef}
        style={{
          position: 'absolute',
          height: '100%',
          width: '1px',
          background: color,
          pointerEvents: 'none',
          opacity: 0,
        }}
      />
    </div>
  );
};

export default SqeresCrosshair;
