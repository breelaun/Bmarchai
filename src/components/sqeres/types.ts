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
  wallPosition: {
    x: number;
    y: number;
  };
}