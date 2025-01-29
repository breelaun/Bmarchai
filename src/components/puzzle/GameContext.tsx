import { createContext, useContext, useState, ReactNode } from 'react';

interface GameContextType {
  words: string[];
  foundWords: string[];
  grid: string[][];
  selectedCells: number[][];
  currentWord: string;
  setWords: (words: string[]) => void;
  setFoundWords: (words: string[]) => void;
  setGrid: (grid: string[][]) => void;
  setSelectedCells: (cells: number[][]) => void;
  setCurrentWord: (word: string) => void;
  addFoundWord: (word: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [words, setWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [grid, setGrid] = useState<string[][]>([]);
  const [selectedCells, setSelectedCells] = useState<number[][]>([]);
  const [currentWord, setCurrentWord] = useState('');

  const addFoundWord = (word: string) => {
    setFoundWords((prev) => [...prev, word]);
  };

  return (
    <GameContext.Provider
      value={{
        words,
        foundWords,
        grid,
        selectedCells,
        currentWord,
        setWords,
        setFoundWords,
        setGrid,
        setSelectedCells,
        setCurrentWord,
        addFoundWord,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};