export const createInitialGrid = () => {
  const grid = [];
  for (let i = 0; i < 15; i++) {
    const row = [];
    for (let j = 0; j < 15; j++) {
      row.push({ row: i, col: j, text: '', isSelected: false, isFound: false });
    }
    grid.push(row);
  }
  return grid;
};

export const placeWordsInGrid = (grid, words) => {
  // Logic for placing words in the grid
};

export const fillEmptyCells = (grid) => {
  // Logic for filling empty grid cells with random letters
};

export const highlightFoundWord = (word, grid) => {
  // Logic for highlighting a found word in the grid
};
