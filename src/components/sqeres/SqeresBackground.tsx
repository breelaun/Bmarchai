import React, { useEffect, useRef } from 'react';

interface SqeresBackgroundProps {
  speed: number;
  squareSize: number;
  direction: "up" | "down" | "left" | "right" | "diagonal";
  borderColor: string;
}

export const SqeresBackground: React.FC<SqeresBackgroundProps> = ({ 
  speed, 
  squareSize, 
  direction, 
  borderColor 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    let offset = 0;

    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;

      // Calculate movement based on direction
      const getOffset = () => {
        offset += speed;
        switch (direction) {
          case "up": return { x: 0, y: -offset };
          case "down": return { x: 0, y: offset };
          case "left": return { x: -offset, y: 0 };
          case "right": return { x: offset, y: 0 };
          case "diagonal": return { x: offset, y: offset };
        }
      };

      const { x: offsetX, y: offsetY } = getOffset();

      // Draw grid
      for (let x = -squareSize; x <= canvas.width + squareSize; x += squareSize) {
        for (let y = -squareSize; y <= canvas.height + squareSize; y += squareSize) {
          const drawX = (x + offsetX) % squareSize;
          const drawY = (y + offsetY) % squareSize;
          
          ctx.strokeRect(drawX, drawY, squareSize, squareSize);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [speed, squareSize, direction, borderColor]);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};