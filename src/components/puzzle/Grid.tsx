import { Cell } from './types';

interface GridProps {
  grid: Cell[][];
  onCellClick: (cell: Cell) => void;
  onCellMouseDown: (cell: Cell) => void;
  onCellMouseEnter: (cell: Cell) => void;
  onCellMouseUp: () => void;
}

const Grid = ({ grid, onCellClick, onCellMouseDown, onCellMouseEnter, onCellMouseUp }: GridProps) => {
  return (
    <div className="w-full max-w-[600px] mx-auto">
      <div className="grid grid-cols-15 gap-0.5 md:gap-1">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square flex items-center justify-center text-xs md:text-base lg:text-lg font-bold cursor-pointer
                ${cell.isSelected ? 'bg-primary text-primary-foreground' : 'bg-secondary'}
                ${cell.isFound ? 'bg-green-500 text-white' : ''}
                hover:bg-primary/80 hover:text-primary-foreground
                transition-colors rounded
              `}
              onClick={() => onCellClick(cell)}
              onMouseDown={() => onCellMouseDown(cell)}
              onMouseEnter={() => onCellMouseEnter(cell)}
              onMouseUp={onCellMouseUp}
            >
              {cell.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;