import { GridProps, Cell } from "./types";
import { cn } from "@/lib/utils";

const Grid = ({ grid, onCellClick, onCellMouseDown, onCellMouseEnter, onCellMouseUp }: GridProps) => {
  return (
    <div className="grid grid-cols-15 gap-1 bg-card p-4 rounded-lg shadow-inner">
      {grid.map((row) => (
        row.map((cell) => (
          <button
            key={`${cell.row}-${cell.col}`}
            onClick={() => onCellClick(cell)}
            onMouseDown={() => onCellMouseDown(cell)}
            onMouseEnter={() => onCellMouseEnter(cell)}
            onMouseUp={onCellMouseUp}
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10",
              "flex items-center justify-center",
              "rounded-md font-bold text-sm sm:text-base",
              "transition-all duration-200 transform",
              cell.isFound && "bg-green-500 text-white scale-95",
              cell.isSelected && "bg-primary text-primary-foreground scale-105",
              !cell.isFound && !cell.isSelected && "bg-card hover:bg-muted hover:scale-105",
              "active:scale-95"
            )}
            disabled={cell.isFound}
          >
            {cell.text}
          </button>
        ))
      ))}
    </div>
  );
};

export default Grid;