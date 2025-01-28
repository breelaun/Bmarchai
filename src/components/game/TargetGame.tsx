import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SqeresBackground } from '../sqeres/SqeresBackground';
import { SqeresCrosshair } from '../sqeres/SqeresCrosshair';

const TargetGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('targetGameHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [gameDirection, setGameDirection] = useState<'right' | 'left' | 'up' | 'down' | 'diagonal'>('right');
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const lockTimer = useRef<NodeJS.Timeout | null>(null);
  const animationFrameId = useRef<number | null>(null);
  
  const [targetPosition, setTargetPosition] = useState({
    x: Math.random() * 80 + 10, // 10-90% of width
    y: Math.random() * 80 + 10, // 10-90% of height
  });

  // Initialize target movement
  useEffect(() => {
    let lastTime = 0;
    const targetSpeed = 2;
    const targetDirection = { x: 1, y: 1 };

    const moveTarget = (currentTime: number) => {
      if (isPaused) return;
      
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (deltaTime === 0) return;

      setTargetPosition(prev => {
        const newX = prev.x + targetDirection.x * targetSpeed * (deltaTime / 16);
        const newY = prev.y + targetDirection.y * targetSpeed * (deltaTime / 16);

        // Bounce off walls
        if (newX <= 0 || newX >= 90) targetDirection.x *= -1;
        if (newY <= 0 || newY >= 90) targetDirection.y *= -1;

        return {
          x: Math.max(0, Math.min(90, newX)),
          y: Math.max(0, Math.min(90, newY))
        };
      });

      animationFrameId.current = requestAnimationFrame(moveTarget);
    };

    animationFrameId.current = requestAnimationFrame(moveTarget);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    if (isPaused) return;
    
    const directions = ['up', 'down', 'left', 'right', 'diagonal'];
    const changeInterval = setInterval(() => {
      const newDirection = directions[Math.floor(Math.random() * directions.length)];
      setGameDirection(newDirection);
    }, 5000);

    return () => clearInterval(changeInterval);
  }, [isPaused]);

  // Handle target hit
  const handleTargetHit = () => {
    if (isPaused) return;
    
    setScore(prev => {
      const newScore = prev + (isLocked ? 100 : 50);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('targetGameHighScore', newScore.toString());
      }
      return newScore;
    });

    // Reset target position
    setTargetPosition({
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    });

    // Explosion animation
    if (targetRef.current) {
      gsap.to(targetRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(targetRef.current, {
            scale: 1,
            opacity: 1,
          });
        },
      });
    }
  };

  // Handle mouse tracking for lock-on
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPaused) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    const distance = Math.sqrt(
      Math.pow(mouseX - targetPosition.x, 2) + 
      Math.pow(mouseY - targetPosition.y, 2)
    );

    if (distance < 5) { // Lock-on threshold
      if (!isLocked) {
        lockTimer.current = setTimeout(() => {
          setIsLocked(true);
          handleTargetHit();
        }, 500); // Lock-on time
      }
    } else {
      if (lockTimer.current) {
        clearTimeout(lockTimer.current);
        lockTimer.current = null;
      }
      setIsLocked(false);
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0">
        <SqeresBackground
          speed={0.5}
          squareSize={40}
          direction={gameDirection}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>

      <div
        ref={targetRef}
        className="absolute w-8 h-8 bg-yellow-400 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${targetPosition.x}%`,
          top: `${targetPosition.y}%`,
          transition: 'left 0.1s linear, top 0.1s linear',
        }}
        onClick={handleTargetHit}
      />

      <SqeresCrosshair
        containerRef={containerRef}
        color={isLocked ? '#ff0000' : '#ffffff'}
      />

      <div className="absolute top-4 left-4 text-white space-y-2">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
        <button
          className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default TargetGame;
