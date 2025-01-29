import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface WeaponEffectsProps {
  weapon: string;
  position: { x: number; y: number };
  onComplete: () => void;
}

export const WeaponEffects: React.FC<WeaponEffectsProps> = ({ weapon, position, onComplete }) => {
  const effectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!effectRef.current) return;

    switch (weapon) {
      case 'laser':
        gsap.fromTo(effectRef.current,
          { 
            width: '2px',
            height: '100vh',
            backgroundColor: '#ff0000',
            opacity: 0.8 
          },
          {
            opacity: 0,
            duration: 0.2,
            ease: "power1.out",
            onComplete
          }
        );
        break;

      case 'lightning':
        // Create lightning effect
        const lightning = effectRef.current;
        lightning.innerHTML = createLightningPath();
        gsap.fromTo(lightning,
          { opacity: 1 },
          {
            opacity: 0,
            duration: 0.3,
            ease: "power1.out",
            onComplete
          }
        );
        break;

      case 'shotgun':
        // Create pellet spread
        const pellets = Array(8).fill(0).map((_, i) => {
          const pellet = document.createElement('div');
          pellet.className = 'absolute w-1 h-1 bg-yellow-500 rounded-full';
          const angle = (i * 10) - 35; // Spread from -35 to +35 degrees
          return pellet;
        });
        
        effectRef.current.append(...pellets);
        
        pellets.forEach((pellet, i) => {
          gsap.to(pellet, {
            x: Math.cos(i * 10 * Math.PI / 180) * 100,
            y: Math.sin(i * 10 * Math.PI / 180) * 100,
            opacity: 0,
            duration: 0.2,
            ease: "power1.out",
          });
        });
        
        gsap.delayedCall(0.2, onComplete);
        break;
    }
  }, [weapon, position, onComplete]);

  return (
    <div
      ref={effectRef}
      className="absolute pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

// Helper function to create SVG lightning path
const createLightningPath = () => {
  const points = [];
  let x = 0;
  let y = 0;
  
  for (let i = 0; i < 10; i++) {
    x += (Math.random() - 0.5) * 20;
    y += 20;
    points.push(`${x},${y}`);
  }
  
  return `
    <svg width="100" height="200">
      <path
        d="M0,0 ${points.join(' ')}"
        stroke="#00ffff"
        stroke-width="2"
        fill="none"
      />
    </svg>
  `;
};

export default WeaponEffects;
