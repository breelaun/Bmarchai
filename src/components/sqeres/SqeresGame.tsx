import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SqeresBackground } from './SqeresBackground';
import { SqeresCrosshair } from './SqeresCrosshair';
import { GameState } from './types';

interface Position {
  x: number;
  y: number;
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
}

const SqeresGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem("sqeresHighScore") || "0"),
    isPaused: true,
    isLocked: false,
    lives: 5,
    targetPositions: [{ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }],
    obstaclePositions: [{ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }],
    currentWeapon: WEAPONS.default,
    gameSpeed: 0.5,
    tutorial: true,
    firstGame: true,
    readyToStart: false,
    gameDirection: "right"
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const soundsRef = useRef<Record<string, HTMLAudioElement>>({});
  const animationFrameId = useRef<number | null>(null);

  // Initialize sounds
  useEffect(() => {
    const sounds = {
      shoot: new Audio('/sounds/shoot.mp3'),
      laser: new Audio('/sounds/laser.mp3'),
      thunder: new Audio('/sounds/thunder.mp3'),
      shotgun: new Audio('/sounds/shotgun.mp3'),
      powerup: new Audio('/sounds/powerup.mp3'),
      hit: new Audio('/sounds/hit.mp3'),
      gameOver: new Audio('/sounds/gameover.mp3')
    };
    
    Object.values(sounds).forEach(sound => {
      sound.load();
      sound.volume = 0.3;
    });
    
    soundsRef.current = sounds;
  }, []);

  // Change direction periodically
  useEffect(() => {
    if (gameState.lives === 0 || gameState.isPaused) return;

    const directions: ("up" | "down" | "left" | "right" | "diagonal")[] = 
      ["up", "down", "left", "right", "diagonal"];
    
    const changeInterval = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        gameDirection: directions[Math.floor(Math.random() * directions.length)]
      }));
    }, 5000);

    return () => clearInterval(changeInterval);
  }, [gameState.isPaused, gameState.lives]);

  // Handle target movement
  useEffect(() => {
    if (gameState.lives === 0 || gameState.isPaused) return;

    const moveTargets = () => {
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
          
          return { x: newX, y: newY };
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

    const damage = weapon.damage;
    const newScore = gameState.score + (damage * (gameState.isLocked ? 2 : 1));
    const newHighScore = Math.max(newScore, gameState.highScore);
    
    let newTargets = [...gameState.targetPositions];
    let newObstacles = [...gameState.obstaclePositions];

    if (newScore >= 1000 && newTargets.length === 1) {
      newTargets.push({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
      newObstacles.push({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 });
    }

    setGameState(prev => ({
      ...prev,
      score: newScore,
      highScore: newHighScore,
      targetPositions: newTargets,
      obstaclePositions: newObstacles,
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

  const closeTutorial = () => {
    setGameState(prev => ({
      ...prev,
      tutorial: false,
      readyToStart: true
    }));
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: false,
      readyToStart: false,
      firstGame: false
    }));
  };

  // Add a pauseGame function for clarity
  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };
  
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

      {/* Tutorial Overlay */}
      {gameState.tutorial && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-white text-center p-8 bg-white/10 rounded-lg max-w-lg">
            <h2 className="text-3xl mb-6">How to Play</h2>
            <ul className="space-y-4 text-left mb-6">
              <li>🎯 Click to shoot the yellow target</li>
              <li>⚡ Collect power-ups for special weapons:</li>
              <li className="pl-4">🔴 Laser - High damage beam</li>
              <li className="pl-4">⚡ Lightning - Area damage</li>
              <li className="pl-4">🔫 Shotgun - Wide spread</li>
              <li>❤️ You have 5 lives - Don't let obstacles touch you!</li>
            </ul>
            <button
              className="px-6 py-3 bg-white/20 rounded hover:bg-white/30 transition"
              onClick={closeTutorial}
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Ready to Start Screen */}
      {gameState.readyToStart && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <button
            className="px-8 py-4 bg-green-500/50 rounded-lg text-white text-2xl hover:bg-green-500/70 transition"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}

      {/* UI Elements */}
      <div className="absolute top-4 left-4 text-white space-y-2">
        <div>Score: {gameState.score}</div>
        <div>High Score: {gameState.highScore}</div>
        <div>Lives: {gameState.lives}</div>
        <div className="flex items-center gap-2">
          <div>Weapon:</div>
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: gameState.currentWeapon.color }}
          />
          <div className="capitalize">{gameState.currentWeapon.name}</div>
        </div>

        {gameState.lives > 0 && !gameState.tutorial && !gameState.readyToStart && (
          <button
            className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
            onClick={togglePause}
          >
            {gameState.isPaused ? "Resume" : "Pause"}
          </button>
        )}
        
        {gameState.lives === 0 && (
          <div className="text-red-500 font-bold text-lg">Game Over</div>
        )}
      </div>

      {/* Only show movement and allow interactions when not paused */}
      {!gameState.isPaused && /* ... game elements ... */}
    </div>
  );
};

export default SqeresGame;
