import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SqeresBackground } from './SqeresBackground';
import { SqeresCrosshair } from './SqeresCrosshair';
import type { GameState } from './types';

const SqeresGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem("sqeresHighScore") || "0"),
    isPaused: false,
    isLocked: false,
    targetPosition: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
    wallPosition: { x: 50, y: 50 },
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const lockTimer = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [gameDirection, setGameDirection] = useState<"up" | "down" | "left" | "right" | "diagonal">("right");

  useEffect(() => {
    const changeDirection = () => {
      const directions: ("up" | "down" | "left" | "right" | "diagonal")[] = ["up", "down", "left", "right", "diagonal"];
      const newDirection = directions[Math.floor(Math.random() * directions.length)];
      setGameDirection(newDirection);
    };

    const directionInterval = setInterval(changeDirection, 5000);
    return () => clearInterval(directionInterval);
  }, []);

  useEffect(() => {
    if (gameState.isPaused) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const moveTarget = () => {
      if (!gameState.isLocked) {
        setGameState(prev => ({
          ...prev,
          targetPosition: {
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10
          }
        }));
      }
    };

    const moveWall = () => {
      setGameState(prev => ({
        ...prev,
        wallPosition: {
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10
        }
      }));
    };

    const gameInterval = setInterval(() => {
      moveTarget();
      moveWall();
    }, 2000);

    return () => clearInterval(gameInterval);
  }, [gameState.isPaused, gameState.isLocked]);

  const handleTargetHit = () => {
    if (gameState.isLocked) return;

    setGameState(prev => {
      const newScore = prev.score + 1;
      const newHighScore = Math.max(newHighScore, prev.highScore);
      localStorage.setItem("sqeresHighScore", newHighScore.toString());
      
      return {
        ...prev,
        score: newScore,
        highScore: newHighScore,
        isLocked: true
      };
    });

    if (targetRef.current) {
      gsap.to(targetRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(targetRef.current, { scale: 1, opacity: 1 });
        }
      });
    }

    if (lockTimer.current) {
      clearTimeout(lockTimer.current);
    }

    lockTimer.current = window.setTimeout(() => {
      setGameState(prev => ({ ...prev, isLocked: false }));
    }, 1000);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <SqeresBackground speed={0.5} squareSize={40} direction={gameDirection} borderColor="#333" />
      
      {containerRef.current && (
        <SqeresCrosshair 
          containerRef={containerRef} 
          color={gameState.isLocked ? "#ff0000" : "#ffffff"} 
        />
      )}

      <div
        ref={targetRef}
        className="absolute w-8 h-8 bg-yellow-400 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${gameState.targetPosition.x}%`,
          top: `${gameState.targetPosition.y}%`,
          transition: "left 0.1s linear, top 0.1s linear",
        }}
        onClick={handleTargetHit}
      />

      <div
        className="absolute w-20 h-5 bg-gray-600"
        style={{
          left: `${gameState.wallPosition.x}%`,
          top: `${gameState.wallPosition.y}%`,
          transition: "left 0.1s linear, top 0.1s linear",
        }}
      />

      <div className="absolute top-4 left-4 text-white space-y-2">
        <div>Score: {gameState.score}</div>
        <div>High Score: {gameState.highScore}</div>
        <button
          className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
          onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
        >
          {gameState.isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
};

export default SqeresGame;