import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { SqeresBackground } from './SqeresBackground';
import { EnhancedCrosshair } from './EnhancedCrosshair';

interface PowerUp {
  type: 'freeze' | 'shield' | 'multishot' | 'extraLife';
  position: { x: number; y: number };
  active: boolean;
  duration?: number;
}

interface GameState {
  score: number;
  highScore: number;
  lives: number;
  isPaused: boolean;
  isGameOver: boolean;
  targetPosition: { x: number; y: number };
  enemies: Array<{
    id: number;
    position: { x: number; y: number };
    type: 'normal' | 'fast' | 'teleporting';
    frozen: boolean;
  }>;
  powerUps: PowerUp[];
  multiplier: number;
  shield: boolean;
  multishot: boolean;
  canWatchAd: boolean;
  gridSize: number;
}

const SqeresGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem("sqeresHighScore") || "0"),
    lives: 5,
    isPaused: false,
    isGameOver: false,
    targetPosition: { x: 40, y: 40 },
    enemies: [{ id: 1, position: { x: 0, y: 0 }, type: 'normal', frozen: false }],
    powerUps: [],
    multiplier: 1,
    shield: false,
    multishot: false,
    canWatchAd: true,
    gridSize: 40,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [adModalOpen, setAdModalOpen] = useState(false);

  // Spawn power-ups periodically
  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const spawnPowerUp = () => {
      const types: PowerUp['type'][] = ['freeze', 'shield', 'multishot', 'extraLife'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      
      setGameState(prev => ({
        ...prev,
        powerUps: [...prev.powerUps, {
          type: randomType,
          position: {
            x: Math.random() * 80 + 10,
            y: Math.random() * 80 + 10
          },
          active: true,
          duration: 10000
        }]
      }));
    };

    const powerUpInterval = setInterval(spawnPowerUp, 15000);
    return () => clearInterval(powerUpInterval);
  }, [gameState.isPaused, gameState.isGameOver]);

  // Enemy movement and spawning
  useEffect(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const moveEnemies = () => {
      setGameState(prev => ({
        ...prev,
        enemies: prev.enemies.map(enemy => {
          if (enemy.frozen) return enemy;

          const speed = enemy.type === 'fast' ? 3 : 2;
          const targetPos = prev.targetPosition;
          const enemyPos = enemy.position;
          
          let newPos;
          if (enemy.type === 'teleporting' && Math.random() < 0.02) {
            newPos = {
              x: Math.random() * 80 + 10,
              y: Math.random() * 80 + 10
            };
          } else {
            const dx = targetPos.x - enemyPos.x;
            const dy = targetPos.y - enemyPos.y;
            const angle = Math.atan2(dy, dx);
            newPos = {
              x: enemyPos.x + Math.cos(angle) * speed,
              y: enemyPos.y + Math.sin(angle) * speed
            };
          }

          // Check collision with target
          const distance = Math.hypot(newPos.x - targetPos.x, newPos.y - targetPos.y);
          if (distance < 20 && !prev.shield) {
            setTimeout(() => {
              setGameState(state => ({
                ...state,
                lives: state.lives - 1,
                isGameOver: state.lives <= 1,
                shield: false
              }));
            }, 0);
          }

          return {
            ...enemy,
            position: newPos
          };
        })
      }));
    };

    const spawnNewEnemy = () => {
      if (gameState.enemies.length < 3) {
        const types: Array<'normal' | 'fast' | 'teleporting'> = ['normal', 'fast', 'teleporting'];
        setGameState(prev => ({
          ...prev,
          enemies: [...prev.enemies, {
            id: Date.now(),
            position: { x: 0, y: 0 },
            type: types[Math.floor(Math.random() * types.length)],
            frozen: false
          }]
        }));
      }
    };

    const enemyInterval = setInterval(moveEnemies, 50);
    const spawnInterval = setInterval(spawnNewEnemy, 20000);
    
    return () => {
      clearInterval(enemyInterval);
      clearInterval(spawnInterval);
    };
  }, [gameState.isPaused, gameState.isGameOver]);

  // Handle power-up collection
  const collectPowerUp = (powerUp: PowerUp) => {
    switch (powerUp.type) {
      case 'freeze':
        setGameState(prev => ({
          ...prev,
          enemies: prev.enemies.map(enemy => ({ ...enemy, frozen: true })),
          powerUps: prev.powerUps.filter(p => p !== powerUp)
        }));
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            enemies: prev.enemies.map(enemy => ({ ...enemy, frozen: false }))
          }));
        }, powerUp.duration);
        break;
      case 'shield':
        setGameState(prev => ({
          ...prev,
          shield: true,
          powerUps: prev.powerUps.filter(p => p !== powerUp)
        }));
        setTimeout(() => {
          setGameState(prev => ({ ...prev, shield: false }));
        }, powerUp.duration);
        break;
      case 'multishot':
        setGameState(prev => ({
          ...prev,
          multishot: true,
          powerUps: prev.powerUps.filter(p => p !== powerUp)
        }));
        setTimeout(() => {
          setGameState(prev => ({ ...prev, multishot: false }));
        }, powerUp.duration);
        break;
      case 'extraLife':
        setGameState(prev => ({
          ...prev,
          lives: prev.lives + 1,
          powerUps: prev.powerUps.filter(p => p !== powerUp)
        }));
        break;
    }
  };

  // Handle watching ad for extra life
  const handleWatchAd = () => {
    setAdModalOpen(true);
    // Simulated ad view
    setTimeout(() => {
      setAdModalOpen(false);
      setGameState(prev => ({
        ...prev,
        lives: prev.lives + 1,
        canWatchAd: false
      }));
    }, 5000);
  };

  // Rest of the component (render method)...
  return (
    <div className="relative w-full h-screen overflow-hidden" ref={containerRef}>
      <SqeresBackground speed={0.5} squareSize={gameState.gridSize} direction="right" />
      
      {containerRef.current && (
        <EnhancedCrosshair containerRef={containerRef} color="#ffffff" />
      )}

      {/* Target */}
      <div
        ref={targetRef}
        className="absolute w-8 h-8 bg-yellow-400 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${gameState.targetPosition.x}%`,
          top: `${gameState.targetPosition.y}%`,
          boxShadow: gameState.shield ? '0 0 20px #00ff00' : 'none'
        }}
        onClick={() => {/* handle target hit */}}
      />

      {/* Enemies */}
      {gameState.enemies.map(enemy => (
        <div
          key={enemy.id}
          className={`absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 ${
            enemy.frozen ? 'opacity-50' : ''
          }`}
          style={{
            left: `${enemy.position.x}%`,
            top: `${enemy.position.y}%`,
            backgroundColor: enemy.type === 'fast' ? '#ff0000' : 
                           enemy.type === 'teleporting' ? '#purple' : '#ff4444'
          }}
        />
      ))}

      {/* Power-ups */}
      {gameState.powerUps.map((powerUp, index) => (
        <div
          key={index}
          className="absolute w-6 h-6 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${powerUp.position.x}%`,
            top: `${powerUp.position.y}%`,
            backgroundColor: 
              powerUp.type === 'freeze' ? '#00ffff' :
              powerUp.type === 'shield' ? '#00ff00' :
              powerUp.type === 'multishot' ? '#ffff00' : '#ff69b4'
          }}
          onClick={() => collectPowerUp(powerUp)}
        />
      ))}

      {/* HUD */}
      <div className="absolute top-4 left-4 text-white space-y-2">
        <div>Score: {gameState.score}</div>
        <div>High Score: {gameState.highScore}</div>
        <div>Lives: {'❤️'.repeat(gameState.lives)}</div>
        <div>Multiplier: x{gameState.multiplier}</div>
        <div className="flex flex-col gap-2">
          <button
            className="px-4 py-2 bg-white/10 rounded hover:bg-white/20"
            onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
          >
            {gameState.isPaused ? "Resume" : "Pause"}
          </button>
          {gameState.lives < 3 && gameState.canWatchAd && (
            <button
              className="px-4 py-2 bg-green-500/30 rounded hover:bg-green-500/40 flex items-center gap-2"
              onClick={handleWatchAd}
            >
              <span>👀</span> Watch Ad for Extra Life
            </button>
          )}
        </div>
      </div>

      {/* Power-up Status */}
      <div className="absolute top-4 right-4 text-white">
        {gameState.shield && (
          <div className="mb-2 px-3 py-1 bg-green-500/30 rounded">
            🛡️ Shield Active
          </div>
        )}
        {gameState.multishot && (
          <div className="mb-2 px-3 py-1 bg-yellow-500/30 rounded">
            🎯 Multishot Active
          </div>
        )}
      </div>

      {/* Game Over Screen */}
      {gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
          <div className="text-white text-center p-8 bg-white/10 rounded-lg backdrop-blur-sm">
            <h2 className="text-4xl mb-4">Game Over!</h2>
            <p className="text-xl mb-4">Final Score: {gameState.score}</p>
            {gameState.canWatchAd && (
              <button
                className="px-6 py-3 bg-green-500/30 rounded hover:bg-green-500/40 mb-4 w-full"
                onClick={handleWatchAd}
              >
                Watch Ad to Continue
              </button>
            )}
            <button
              className="px-6 py-3 bg-white/10 rounded hover:bg-white/20 w-full"
              onClick={() => {
                setGameState({
                  score: 0,
                  highScore: gameState.highScore,
                  lives: 5,
                  isPaused: false,
                  isGameOver: false,
                  targetPosition: { x: 40, y: 40 },
                  enemies: [{ id: 1, position: { x: 0, y: 0 }, type: 'normal', frozen: false }],
                  powerUps: [],
                  multiplier: 1,
                  shield: false,
                  multishot: false,
                  canWatchAd: true,
                  gridSize: 40,
                });
              }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Ad Modal */}
      {adModalOpen && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
          <div className="text-white text-center p-8 bg-white/10 rounded-lg">
            <h3 className="text-2xl mb-4">Watching Ad...</h3>
            <div className="w-64 h-48 bg-gray-700 mb-4 flex items-center justify-center">
              <img 
                src="/api/placeholder/320/240"
                alt="Ad Placeholder" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-sm">You'll receive an extra life in 5 seconds...</div>
          </div>
        </div>
      )}

      {/* Tutorial Overlay (shown on first play) */}
      {gameState.score === 0 && !gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/50 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
            <p className="text-xl mb-2">🎯 Click the yellow target to score points</p>
            <p className="text-xl mb-2">⚡ Collect power-ups to help you survive</p>
            <p className="text-xl">❌ Avoid the red enemies!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SqeresGame;
