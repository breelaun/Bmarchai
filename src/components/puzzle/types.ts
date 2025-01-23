export interface Cell {
  text: string;
  row: number;
  col: number;
  isSelected: boolean;
  isFound: boolean;
  isHighlighted: boolean;
}

export interface WordListProps {
  words: string[];
  foundWords: string[];
}

export interface GridProps {
  grid: Cell[][];
  onCellClick: (cell: Cell) => void;
  onCellMouseDown: (cell: Cell) => void;
  onCellMouseEnter: (cell: Cell) => void;
  onCellMouseUp: () => void;
}

export interface ControlsProps {
  onHint: () => void;
  onRiddle: () => void;
  onReveal: () => void;
  score: number;
  timer: number;
}

export interface MessageDisplayProps {
  message: string;
}