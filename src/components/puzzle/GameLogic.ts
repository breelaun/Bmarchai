import { Cell } from "./types";

export const createInitialGrid = (): Cell[][] => {
  return Array(15).fill(null).map((_, row) =>
    Array(15).fill(null).map((_, col) => ({
      text: '',
      row,
      col,
      isSelected: false,
      isFound: false,
      isHighlighted: false
    }))
  );
};

export const placeWordsInGrid = (grid: Cell[][], words: string[]) => {
  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal down-right
    [-1, 1],  // diagonal up-right
  ];

  const shuffledWords = [...words].sort(() => Math.random() - 0.5);

  for (const word of shuffledWords) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * grid.length);
      const startCol = Math.floor(Math.random() * grid[0].length);

      if (canPlaceWord(grid, word, startRow, startCol, direction)) {
        placeWord(grid, word, startRow, startCol, direction);
        placed = true;
      }
      attempts++;
    }
  }
  return grid;
};

export const canPlaceWord = (grid: Cell[][], word: string, startRow: number, startCol: number, direction: number[]) => {
  const [dy, dx] = direction;
  if (
    startRow + dy * (word.length - 1) < 0 ||
    startRow + dy * (word.length - 1) >= grid.length ||
    startCol + dx * (word.length - 1) < 0 ||
    startCol + dx * (word.length - 1) >= grid[0].length
  ) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const row = startRow + dy * i;
    const col = startCol + dx * i;
    if (grid[row][col].text !== '' && grid[row][col].text !== word[i]) {
      return false;
    }
  }
  return true;
};

export const placeWord = (grid: Cell[][], word: string, startRow: number, startCol: number, direction: number[]) => {
  const [dy, dx] = direction;
  for (let i = 0; i < word.length; i++) {
    const row = startRow + dy * i;
    const col = startCol + dx * i;
    grid[row][col].text = word[i];
  }
};

export const fillEmptyCells = (grid: Cell[][]) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col].text === '') {
        grid[row][col].text = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
  return grid;
};

export const highlightFoundWord = (word: string, grid: Cell[][]) => {
  const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
  
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      const directions = [
        [0, 1],   // right
        [1, 0],   // down
        [1, 1],   // diagonal down-right
        [-1, 1],  // diagonal up-right
      ];

      for (const [dy, dx] of directions) {
        if (checkWordAtPosition(word, row, col, dy, dx, newGrid)) {
          for (let i = 0; i < word.length; i++) {
            const currentRow = row + dy * i;
            const currentCol = col + dx * i;
            newGrid[currentRow][currentCol].isFound = true;
          }
          return newGrid;
        }
      }
    }
  }
  return newGrid;
};

export const checkWordAtPosition = (word: string, startRow: number, startCol: number, dy: number, dx: number, grid: Cell[][]) => {
  if (
    startRow + dy * (word.length - 1) < 0 ||
    startRow + dy * (word.length - 1) >= grid.length ||
    startCol + dx * (word.length - 1) < 0 ||
    startCol + dx * (word.length - 1) >= grid[0].length
  ) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const row = startRow + dy * i;
    const col = startCol + dx * i;
    if (grid[row][col].text !== word[i]) {
      return false;
    }
  }
  return true;
};