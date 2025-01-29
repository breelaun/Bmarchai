import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SqeresBackground } from './SqeresBackground';
import { SqeresCrosshair } from './SqeresCrosshair';
import { GameState } from './types';

const SqeresGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem("sqeresHighScore") || "0"),
    isPaused: true,  // 🛑 Game starts paused!
    isLocked: false,
    lives: 5, // 🔴 Player starts with 5 lives
    targetPosition: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
    wallPosition: { x: 50, y: 50 }, 
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const [gameDirection, setGameDirection] = useState<"up" | "down" | "left" | "right" | "diagonal">("right");

  // 🟢 Change direction every 5 seconds
  useEffect(() => {
    if (gameState.lives === 0) return; // Stop if no lives

    const directions: ("up" | "down" | "left" | "right" | "diagonal")[] = ["up", "down", "left", "right", "diagonal"];
    const changeInterval = setInterval(() => {
      setGameDirection(directions[Math.floor(Math.random() * directions.length)]);
    }, 5000);

    return () => clearInterval(changeInterval);
  }, [gameState.isPaused, gameState.lives]);

  // 🟢 Move target & wall
  useEffect(() => {
    if (gameState.lives === 0) return; // Stop movement if game over

    let lastTime = 0;
    let targetSpeed = Math.random() * 0.8 + 0.5;
    let wallSpeed = Math.random() * 1.2 + 0.8;

    const moveObjects = (currentTime: number) => {
      if (gameState.isPaused) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      if (deltaTime === 0) return;

      const getDirection = () => {
        switch (gameDirection) {
          case "up": return { x: 0, y: -1 };
          case "down": return { x: 0, y: 1 };
          case "left": return { x: -1, y: 0 };
          case "right": return { x: 1, y: 0 };
          case "diagonal": return { x: Math.random() < 0.5 ? 1 : -1, y: Math.random() < 0.5 ? 1 : -1 };
        }
      };

      const targetDirection = getDirection();
      const wallDirection = getDirection();

      setGameState(prev => ({
        ...prev,
        targetPosition: {
          x: Math.max(0, Math.min(90, prev.targetPosition.x + targetDirection.x * targetSpeed * (deltaTime / 16))),
          y: Math.max(0, Math.min(90, prev.targetPosition.y + targetDirection.y * targetSpeed * (deltaTime / 16))),
        },
        wallPosition: {
          x: Math.max(0, Math.min(90, prev.wallPosition.x + wallDirection.x * wallSpeed * (deltaTime / 16))),
          y: Math.max(0, Math.min(90, prev.wallPosition.y + wallDirection.y * wallSpeed * (deltaTime / 16))),
        }
      }));

      animationFrameId.current = requestAnimationFrame(moveObjects);
    };

    animationFrameId.current = requestAnimationFrame(moveObjects);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState.isPaused, gameState.targetPosition, gameDirection, gameState.lives]);

  // 🟢 Check collision (Wall touches Target)
  useEffect(() => {
    const checkCollision = () => {
      const dx = gameState.wallPosition.x - gameState.targetPosition.x;
      const dy = gameState.wallPosition.y - gameState.targetPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        setGameState(prev => ({
          ...prev,
          lives: prev.lives - 1, // 🔴 Lose a life
          targetPosition: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }, 
          wallPosition: { x: 50, y: 50 }, 
        }));
      }
    };

    const interval = setInterval(checkCollision, 100);
    return () => clearInterval(interval);
  }, [gameState.wallPosition, gameState.targetPosition, gameState.lives]);

  // 🟢 Handle target hit
  const handleTargetHit = () => {
    if (gameState.isPaused || gameState.lives === 0) return;

    const newScore = gameState.score + (gameState.isLocked ? 100 : 50);
    const newHighScore = Math.max(newScore, gameState.highScore);

    setGameState(prev => ({
      ...prev,
      score: newScore,
      highScore: newHighScore,
      targetPosition: { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 },
    }));

    localStorage.setItem("sqeresHighScore", newHighScore.toString());

    if (targetRef.current) {
      gsap.to(targetRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(targetRef.current, { scale: 1, opacity: 1 });
        },
      });
    }
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden" ref={containerRef}>
      {/* Background Animation */}
      <SqeresBackground speed={0.5} squareSize={40} direction={gameDirection} borderColor="#333" />

      {/* Crosshair */}
      <SqeresCrosshair containerRef={containerRef} color={gameState.isLocked ? "#ff0000" : "#ffffff"} />

      {/* Moving Target */}
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

      {/* Moving Wall */}
      <div
        ref={wallRef}
        className="absolute w-20 h-5 bg-red-600"
        style={{
          left: `${gameState.wallPosition.x}%`,
          top: `${gameState.wallPosition.y}%`,
          transition: "left 0.1s linear, top 0.1s linear",
        }}
      />

      {/* UI */}
      <div className="absolute top-4 left-4 text-white space-y-2">
        <div>Score: {gameState.score}</div>
        <div>High Score: {gameState.highScore}</div>
        <div>Lives: {gameState.lives}</div>

        {gameState.lives > 0 ? (
          <button
            className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
            onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
          >
            {gameState.isPaused ? "Start" : "Pause"}
          </button>
        ) : (
          <div className="text-red-500 font-bold text-lg">Game Over</div>
        )}
      </div>
    </div>
  );
};

export default SqeresGame;
