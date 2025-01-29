import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SqeresBackground } from './SqeresBackground';
import { SqeresCrosshair } from './SqeresCrosshair';

interface GameState {
  score: number;
  highScore: number;
  lives: number;
  isPaused: boolean;
  isGameOver: boolean;
  targetPosition: { x: number; y: number };
  enemyPosition: { x: number; y: number };
  gridSize: number;
}

const SqeresGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem("sqeresHighScore") || "0"),
    lives: 3,
    isPaused: false,
    isGameOver: false,
    targetPosition: { x: 40, y: 40 },
    enemyPosition: { x: 0, y: 0 },
    gridSize: 40,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [backgroundColorState, setBackgroundColorState] = useState(0);
  const colors = ['#000000', '#333333', '#666666', '#999999'];
  
  // Calculate grid-based positions
  const snapToGrid = (position: { x: number; y: number }) => ({
    x: Math.round(position.x / gameState.gridSize) * gameState.gridSize,
    y: Math.round(position.y / gameState.gridSize) * gameState.gridSize,
  });

  // Enemy movement
  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const moveEnemy = () => {
      const targetPos = gameState.targetPosition;
      const enemyPos = gameState.enemyPosition;
      
      // Move enemy towards target
      const dx = targetPos.x - enemyPos.x;
      const dy = targetPos.y - enemyPos.y;
      const angle = Math.atan2(dy, dx);
      
      setGameState(prev => {
        const newX = enemyPos.x + Math.cos(angle) * 2;
        const newY = enemyPos.y + Math.sin(angle) * 2;
        
        // Check collision with target
        const distance = Math.hypot(newX - targetPos.x, newY - targetPos.y);
        if (distance < 20) {
          // Enemy caught the target
          return {
            ...prev,
            lives: prev.lives - 1,
            isGameOver: prev.lives <= 1,
            targetPosition: snapToGrid({
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10
            }),
            enemyPosition: { x: 0, y: 0 }
          };
        }

        return {
          ...prev,
          enemyPosition: { x: newX, y: newY }
        };
      });
    };

    const enemyInterval = setInterval(moveEnemy, 50);
    return () => clearInterval(enemyInterval);
  }, [gameState.isPaused, gameState.isGameOver, gameState.targetPosition, gameState.enemyPosition]);

  // Background color cycling
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setBackgroundColorState(prev => (prev + 1) % colors.length);
    }, 5000);
    return () => clearInterval(colorInterval);
  }, []);

  const handleTargetHit = () => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const newScore = gameState.score + 50;
    const newHighScore = Math.max(newScore, gameState.highScore);

    setGameState(prev => ({
      ...prev,
      score: newScore,
      highScore: newHighScore,
      targetPosition: snapToGrid({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      })
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

  const resetGame = () => {
    setGameState({
      ...gameState,
      score: 0,
      lives: 3,
      isGameOver: false,
      targetPosition: snapToGrid({ x: 40, y: 40 }),
      enemyPosition: { x: 0, y: 0 }
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" ref={containerRef}>
      <SqeresBackground 
        speed={0.5} 
        squareSize={gameState.gridSize} 
        direction="right" 
        borderColor={colors[backgroundColorState]}
      />
      
      {containerRef.current && (
        <SqeresCrosshair 
          containerRef={containerRef} 
          color="#ffffff"
          fullscreen={true}
          showBlur={true}
        />
      )}

      <div
        ref={targetRef}
        className="absolute w-8 h-8 bg-yellow-400 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${gameState.targetPosition.x}%`,
          top: `${gameState.targetPosition.y}%`,
          transition: "left 0.3s ease-out, top 0.3s ease-out",
        }}
        onClick={handleTargetHit}
      />

      <div
        className="absolute w-8 h-8 bg-red-600 transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${gameState.enemyPosition.x}%`,
          top: `${gameState.enemyPosition.y}%`,
        }}
      />

      <div className="absolute top-4 left-4 text-white space-y-2">
        <div>Score: {gameState.score}</div>
        <div>High Score: {gameState.highScore}</div>
        <div>Lives: {'❤️'.repeat(gameState.lives)}</div>
        <button
          className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
          onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
        >
          {gameState.isPaused ? "Resume" : "Pause"}
        </button>
      </div>

      {gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-white text-center">
            <h2 className="text-4xl mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Final Score: {gameState.score}</p>
            <button
              className="px-6 py-3 bg-white/10 rounded hover:bg-white/20"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SqeresGame;
