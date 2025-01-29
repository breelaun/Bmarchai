import { useGame } from './GameContext';

const Grid = () => {
  const { grid, selectedCells, setSelectedCells, currentWord, setCurrentWord } = useGame();

  const handleCellClick = (row: number, col: number) => {
    const newSelectedCells = [[row, col]];
    setSelectedCells(newSelectedCells);
    setCurrentWord(grid[row][col]);
  };

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col);
  };

  const isCellFound = (row: number, col: number) => {
    // Check if this cell is part of a found word
    return false; // This will be implemented in the game logic
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="grid grid-cols-15 gap-1">
        {grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square flex items-center justify-center text-lg font-bold rounded
                ${isCellSelected(rowIndex, colIndex) ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'}
                ${isCellFound(rowIndex, colIndex) ? 'bg-green-500 text-white' : ''}
              `}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {letter}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;