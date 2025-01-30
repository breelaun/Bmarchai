import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SqeresBackgroundProps {
  speed: number;
  squareSize: number;
  direction: "right";
  borderColor: string;
}

export const SqeresCrosshair: React.FC<SqeresBackgroundProps> = ({
  speed,
  squareSize,
  direction,
  borderColor
}) => {
  const crosshairRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    if (crosshairRef.current) {
      tl.to(crosshairRef.current, {
        x: direction === "right" ? "+=100" : "-=100",
        duration: speed,
        ease: "power1.inOut",
      })
      .to(crosshairRef.current, {
        x: 0,
        duration: speed,
        ease: "power1.inOut",
      });
    }
  }, [speed, direction]);

  return (
    <div
      ref={crosshairRef}
      style={{
        width: squareSize,
        height: squareSize,
        border: `2px solid ${borderColor}`,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};
