import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SqeresBackground } from './SqeresBackground';
import { SqeresCrosshair } from './SqeresCrosshair';
import EnhancedCrosshair from './EnhancedCrosshair';

interface Position {
  x: number;
  y: number;
  lastMoved?: number;
}

interface WeaponType {
  name: 'default' | 'laser' | 'lightning' | 'shotgun';
  damage: number;
  fireRate: number;
  spread?: number;
  color: string;
  soundEffect: string;
}

const WEAPONS: Record<string, WeaponType> = {
  default: { name: 'default', damage: 1, fireRate: 1, color: '#ffffff', soundEffect: 'shoot.mp3' },
  laser: { name: 'laser', damage: 2, fireRate: 1.5, color: '#ff0000', soundEffect: 'laser.mp3' },
  lightning: { name: 'lightning', damage: 3, fireRate: 0.5, color: '#00ffff', soundEffect: 'thunder.mp3' },
  shotgun: { name: 'shotgun', damage: 1, fireRate: 0.7, spread: 30, color: '#ffaa00', soundEffect: 'shotgun.mp3' }
};

interface GameState {
  score: number;
  highScore: number;
  isPaused: boolean;
  isLocked: boolean;
  lives: number;
  targetPositions: Position[];
  obstaclePositions: Position[];
  currentWeapon: WeaponType;
  gameSpeed: number;
  tutorial: boolean;
  firstGame: boolean;
  readyToStart: boolean;
  gameDirection: "up" | "down" | "left" | "right" | "diagonal";
  lastMoveTime: number;
}

const SqeresGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem("sqeresHighScore") || "0"),
    isPaused: true,
    isLocked: false,
    lives: 5,
    targetPositions: [{ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, lastMoved: Date.now() }],
    obstaclePositions: [{ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }],
    currentWeapon: WEAPONS.default,
    gameSpeed: 0.5,
    tutorial: true,
    firstGame: true,
    readyToStart: false,
    gameDirection: "right",
    lastMoveTime: Date.now()
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const soundsRef = useRef<Record<string, HTMLAudioElement>>({});

  // Check for collisions between targets and obstacles
  useEffect(() => {
    if (gameState.isPaused || gameState.lives <= 0) return;

    const checkCollisions = () => {
      gameState.targetPositions.forEach((target, targetIndex) => {
        gameState.obstaclePositions.forEach(obstacle => {
          const dx = target.x - obstacle.x;
          const dy = target.y - obstacle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 8) { // Collision detected
            setGameState(prev => ({
              ...prev,
              lives: prev.lives - 1,
              targetPositions: prev.targetPositions.map((t, i) => 
                i === targetIndex ? 
                { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, lastMoved: Date.now() } : t
              )
            }));
          }
        });
      });
    };

    const collisionInterval = setInterval(checkCollisions, 100);
    return () => clearInterval(collisionInterval);
  }, [gameState.targetPositions, gameState.obstaclePositions, gameState.isPaused, gameState.lives]);

  // Check for stationary targets
  useEffect(() => {
    if (gameState.isPaused || gameState.lives <= 0) return;

    const checkStationaryTargets = () => {
      const now = Date.now();
      gameState.targetPositions.forEach((target, index) => {
        if (now - (target.lastMoved || 0) > 2000) { // Target hasn't moved in 2 seconds
          setGameState(prev => ({
            ...prev,
            score: Math.max(0, prev.score - 10),
            targetPositions: prev.targetPositions.map((t, i) => 
              i === index ? 
              { x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, lastMoved: now } : t
            )
          }));
        }
      });
    };

    const stationaryInterval = setInterval(checkStationaryTargets, 500);
    return () => clearInterval(stationaryInterval);
  }, [gameState.targetPositions, gameState.isPaused, gameState.lives]);

  // Handle target movement
  useEffect(() => {
    if (gameState.lives <= 0 || gameState.isPaused) return;

    const moveTargets = () => {
      const now = Date.now();
      setGameState(prev => ({
        ...prev,
        targetPositions: prev.targetPositions.map(target => {
          let newX = target.x;
          let newY = target.y;
          
          switch (prev.gameDirection) {
            case "up":
              newY = Math.max(0, newY - prev.gameSpeed);
              break;
            case "down":
              newY = Math.min(90, newY + prev.gameSpeed);
              break;
            case "left":
              newX = Math.max(0, newX - prev.gameSpeed);
              break;
            case "right":
              newX = Math.min(90, newX + prev.gameSpeed);
              break;
            case "diagonal":
              newX = Math.max(0, Math.min(90, newX + (Math.random() < 0.5 ? 1 : -1) * prev.gameSpeed));
              newY = Math.max(0, Math.min(90, newY + (Math.random() < 0.5 ? 1 : -1) * prev.gameSpeed));
              break;
          }
          
          return { x: newX, y: newY, lastMoved: now };
        })
      }));
    };

    const interval = setInterval(moveTargets, 16);
    return () => clearInterval(interval);
  }, [gameState.isPaused, gameState.lives, gameState.gameDirection, gameState.gameSpeed]);

  const handleTargetHit = (e: React.MouseEvent) => {
    if (gameState.isPaused) return;

    const weapon = gameState.currentWeapon;
    const sound = soundsRef.current[weapon.soundEffect];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    }

    // Score is now fixed at 10 points per hit
    const pointsPerHit = 10;
    const newScore = gameState.score + pointsPerHit;
    const newHighScore = Math.max(newScore, gameState.highScore);

    setGameState(prev => ({
      ...prev,
      score: newScore,
      highScore: newHighScore,
      targetPositions: prev.targetPositions.map(target => ({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        lastMoved: Date.now()
      }))
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

  // Rest of the component remains the same...
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden" ref={containerRef}>
      <SqeresBackground 
        speed={gameState.gameSpeed} 
        squareSize={40} 
        direction={gameState.gameDirection} 
        borderColor="#333" 
      />

      <SqeresCrosshair 
        containerRef={containerRef} 
        color={gameState.currentWeapon.color} 
      />

      {/* Game elements */}
      {gameState.targetPositions.map((target, index) => (
        <div
          key={`target-${index}`}
          ref={index === 0 ? targetRef : undefined}
          className="absolute w-8 h-8 bg-yellow-400 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${target.x}%`,
            top: `${target.y}%`,
            transition: "left 0.1s linear, top 0.1s linear",
          }}
          onClick={handleTargetHit}
        />
      ))}

      {gameState.obstaclePositions.map((obstacle, index) => (
        <div
          key={`obstacle-${index}`}
          className="absolute w-10 h-10 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${obstacle.x}%`,
            top: `${obstacle.y}%`,
            transition: "left 0.1s linear, top 0.1s linear",
          }}
        />
      ))}

      {/* Tutorial and UI overlays remain the same... */}
    </div>
  );
};

export default SqeresGame;

