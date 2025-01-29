import { useEffect } from 'react';
import { GameProvider } from '@/components/puzzle/GameContext';
import Grid from '@/components/puzzle/Grid';
import WordList from '@/components/puzzle/WordList';
import Controls from '@/components/puzzle/Controls';

const INITIAL_WORDS = ['HELLO', 'WORLD', 'PUZZLE', 'GAME', 'FUN', 'PLAY'];
const GRID_SIZE = 10;

const generateGrid = (size: number): string[][] => {
  const grid: string[][] = Array(size).fill(null).map(() => 
    Array(size).fill(null).map(() => 
      String.fromCharCode(65 + Math.floor(Math.random() * 26))
    )
  );
  return grid;
};

const PuzzlePage = () => {
  return (
    <GameProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-center mb-8">Word Search Puzzle</h1>
        <div className="max-w-4xl mx-auto">
          <Grid />
          <WordList />
          <Controls />
        </div>
      </div>
    </GameProvider>
  );
};

export default PuzzlePage;