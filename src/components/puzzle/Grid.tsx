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

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${grid[0]?.length || 0}, minmax(0, 1fr))` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square flex items-center justify-center text-lg sm:text-xl font-bold rounded
                ${isCellSelected(rowIndex, colIndex) ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;