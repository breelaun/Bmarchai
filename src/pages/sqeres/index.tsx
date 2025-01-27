// src/pages/sqeres/index.tsx
import SqeresGame from '@/components/sqeres/SqeresGame';

export default function SqeresPage() {
  return (
    <div className="w-full h-screen">
      <SqeresGame />
    </div>
  );
}

// src/components/sqeres/types.ts
export interface SqeresBackgroundProps {
  direction?: 'up' | 'down' | 'left' | 'right' | 'diagonal';
  speed?: number;
  borderColor?: string;
  squareSize?: number;
  hoverFillColor?: string;
}

export interface CrosshairProps {
  color?: string;
  containerRef: React.RefObject<HTMLDivElement> | null;
}

export interface GameState {
  score: number;
  highScore: number;
  isPaused: boolean;
  isLocked: boolean;
  targetPosition: {
    x: number;
    y: number;
  };
}

// src/components/sqeres/SqeresBackground.tsx
import { useRef, useEffect, useState } from 'react';
import { SqeresBackgroundProps } from './types';

export const SqeresBackground: React.FC<SqeresBackgroundProps> = ({
  direction = 'right',
  speed = 1,
  borderColor = '#999',
  squareSize = 40,
  hoverFillColor = '#222',
}) => {
  // Your existing Squares component code with TypeScript types
  // ... (Previous squares code with added type safety)
};

// src/components/sqeres/SqeresCrosshair.tsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CrosshairProps } from './types';

export const SqeresCrosshair: React.FC<CrosshairProps> = ({
  color = 'white',
  containerRef = null,
}) => {
  // Your existing Crosshair component code with TypeScript types
  // ... (Previous crosshair code with added type safety)
};

// src/components/sqeres/SqeresGame.tsx
import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SqeresBackground } from './SqeresBackground';
import { SqeresCrosshair } from './SqeresCrosshair';
import { GameState } from './types';

const SqeresGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem('sqeresHighScore') || '0'),
    isPaused: false,
    isLocked: false,
    targetPosition: {
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const lockTimer = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [gameDirection, setGameDirection] = useState<'up' | 'down' | 'left' | 'right' | 'diagonal'>('right');

  // Target movement effect
  useEffect(() => {
    let lastTime = 0;
    const targetSpeed = 2;
    const targetDirection = { x: 1, y: 1 };

    const moveTarget = (currentTime: number) => {
      if (gameState.isPaused) return;
      
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (deltaTime === 0) return;

      setGameState(prev => ({
        ...prev,
        targetPosition: {
          x: Math.max(0, Math.min(90, prev.targetPosition.x + targetDirection.x * targetSpeed * (deltaTime / 16))),
          y: Math.max(0, Math.min(90, prev.targetPosition.y + targetDirection.y * targetSpeed * (deltaTime / 16)))
        }
      }));

      // Bounce logic
      if (gameState.targetPosition.x <= 0 || gameState.targetPosition.x >= 90) targetDirection.x *= -1;
      if (gameState.targetPosition.y <= 0 || gameState.targetPosition.y >= 90) targetDirection.y *= -1;

      animationFrameId.current = requestAnimationFrame(moveTarget);
    };

    animationFrameId.current = requestAnimationFrame(moveTarget);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState.isPaused, gameState.targetPosition]);

  // Direction change effect
  useEffect(() => {
    if (gameState.isPaused) return;
    
    const directions: ('up' | 'down' | 'left' | 'right' | 'diagonal')[] = 
      ['up', 'down', 'left', 'right', 'diagonal'];
      
    const changeInterval = setInterval(() => {
      setGameDirection(directions[Math.floor(Math.random() * directions.length)]);
    }, 5000);

    return () => clearInterval(changeInterval);
  }, [gameState.isPaused]);

  const handleTargetHit = () => {
    if (gameState.isPaused) return;
    
    const newScore = gameState.score + (gameState.isLocked ? 100 : 50);
    const newHighScore = Math.max(newScore, gameState.highScore);
    
    setGameState(prev => ({
      ...prev,
      score: newScore,
      highScore: newHighScore,
      targetPosition: {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
      }
    }));

    localStorage.setItem('sqeresHighScore', newHighScore.toString());

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState.isPaused || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
    const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

    const distance = Math.sqrt(
      Math.pow(mouseX - gameState.targetPosition.x, 2) + 
      Math.pow(mouseY - gameState.targetPosition.y, 2)
    );

    if (distance < 5) {
      if (!gameState.isLocked) {
        lockTimer.current = window.setTimeout(() => {
          setGameState(prev => ({ ...prev, isLocked: true }));
          handleTargetHit();
        }, 500);
      }
    } else {
      if (lockTimer.current) {
        clearTimeout(lockTimer.current);
        lockTimer.current = null;
      }
      setGameState(prev => ({ ...prev, isLocked: false }));
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
          left: `${gameState.targetPosition.x}%`,
          top: `${gameState.targetPosition.y}%`,
          transition: 'left 0.1s linear, top 0.1s linear',
        }}
        onClick={handleTargetHit}
      />

      <SqeresCrosshair
        containerRef={containerRef}
        color={gameState.isLocked ? '#ff0000' : '#ffffff'}
      />

      <div className="absolute top-4 left-4 text-white space-y-2">
        <div>Score: {gameState.score}</div>
        <div>High Score: {gameState.highScore}</div>
        <button
          className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
          onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
        >
          {gameState.isPaused ? 'Resume' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default SqeresGame;
