const Grid = ({ grid, onCellClick, onCellMouseDown, onCellMouseEnter }) => (
  <div className="grid grid-cols-15 gap-1">
    {grid.map((row, rowIndex) =>
      row.map((cell, colIndex) => (
        <div
          key={`${rowIndex}-${colIndex}`}
          className={`cell ${cell.isSelected ? 'bg-yellow-300' : 'bg-white'} ${
            cell.isFound ? 'bg-green-500' : ''
          }`}
          onMouseDown={() => onCellMouseDown(cell)}
          onMouseEnter={() => onCellMouseEnter(cell)}
          onClick={() => onCellClick(cell)}
        >
          {cell.text}
        </div>
      ))
    )}
  </div>
);
export default Grid;
