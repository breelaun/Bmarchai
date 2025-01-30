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

export interface Position {
  x: number;
  y: number;
}