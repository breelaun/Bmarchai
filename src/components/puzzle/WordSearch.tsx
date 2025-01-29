import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Grid from '@/components/puzzle/Grid';
import WordList from '@/components/puzzle/WordList';
import Controls from '@/components/puzzle/Controls';
import { GameProvider } from './GameContext';
import { createInitialGrid, placeWordsInGrid, fillEmptyCells } from './GameLogic';

const WordSearch = () => {
  const wordPool = [
    "ENDURANCE", "STRENGTH", "CARDIO", "FLEXIBILITY", "NUTRITION",
    "MUSCLES", "WORKOUT", "FITNESS", "HEALTH", "PROTEIN",
    "VITAMINS", "MINERALS"
  ];

  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);

  useEffect(() => {
    const initialGrid = createInitialGrid();
    const gridWithWords = placeWordsInGrid(initialGrid, wordPool);
    if (gridWithWords) {
      const finalGrid = fillEmptyCells(gridWithWords);
      setGrid(finalGrid.map(row => row.map(cell => cell.text)));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Word Search Puzzle</CardTitle>
        </CardHeader>
        <CardContent>
          <GameProvider>
            <Grid />
            <WordList />
            <Controls />
          </GameProvider>
        </CardContent>
      </Card>

      <style jsx>{`
        .grid-cols-15 {
          grid-template-columns: repeat(15, minmax(0, 1fr));
        }
      `}</style>
    </div>
  );
};

export default WordSearch;