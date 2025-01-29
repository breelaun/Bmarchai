import { Cell } from './types';

export const createInitialGrid = () => {
  const grid: Cell[][] = [];
  for (let i = 0; i < 15; i++) {
    const row: Cell[] = [];
    for (let j = 0; j < 15; j++) {
      row.push({ row: i, col: j, text: '', isSelected: false, isFound: false });
    }
    grid.push(row);
  }
  return grid;
};

export const placeWordsInGrid = (grid: Cell[][], words: string[]) => {
  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal right down
    [-1, 1],  // diagonal right up
  ];

  const newGrid = JSON.parse(JSON.stringify(grid));
  const placedWords: string[] = [];

  for (const word of words) {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    while (!placed && attempts < maxAttempts) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const startRow = Math.floor(Math.random() * 15);
      const startCol = Math.floor(Math.random() * 15);

      if (canPlaceWord(newGrid, word, startRow, startCol, direction)) {
        placeWord(newGrid, word, startRow, startCol, direction);
        placed = true;
        placedWords.push(word);
      }
      attempts++;
    }
  }

  return placedWords.length > 0 ? newGrid : null;
};

const canPlaceWord = (grid: Cell[][], word: string, startRow: number, startCol: number, direction: number[]) => {
  const [dy, dx] = direction;
  if (
    startRow + dy * (word.length - 1) < 0 ||
    startRow + dy * (word.length - 1) >= 15 ||
    startCol + dx * (word.length - 1) < 0 ||
    startCol + dx * (word.length - 1) >= 15
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

const placeWord = (grid: Cell[][], word: string, startRow: number, startCol: number, direction: number[]) => {
  const [dy, dx] = direction;
  for (let i = 0; i < word.length; i++) {
    const row = startRow + dy * i;
    const col = startCol + dx * i;
    grid[row][col].text = word[i];
  }
};

export const fillEmptyCells = (grid: Cell[][]) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const newGrid = JSON.parse(JSON.stringify(grid));

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      if (newGrid[i][j].text === '') {
        newGrid[i][j].text = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
  return newGrid;
};

export const highlightFoundWord = (word: string, grid: Cell[][]) => {
  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal right down
    [-1, 1],  // diagonal right up
  ];

  const newGrid = JSON.parse(JSON.stringify(grid));

  for (let row = 0; row < 15; row++) {
    for (let col = 0; col < 15; col++) {
      for (const [dy, dx] of directions) {
        if (checkWordAtPosition(word, newGrid, row, col, dy, dx)) {
          markWordAsFound(word, newGrid, row, col, dy, dx);
          return newGrid;
        }
      }
    }
  }
  return grid;
};

const checkWordAtPosition = (word: string, grid: Cell[][], startRow: number, startCol: number, dy: number, dx: number) => {
  if (
    startRow + dy * (word.length - 1) < 0 ||
    startRow + dy * (word.length - 1) >= 15 ||
    startCol + dx * (word.length - 1) < 0 ||
    startCol + dx * (word.length - 1) >= 15
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

const markWordAsFound = (word: string, grid: Cell[][], startRow: number, startCol: number, dy: number, dx: number) => {
  for (let i = 0; i < word.length; i++) {
    const row = startRow + dy * i;
    const col = startCol + dx * i;
    grid[row][col].isFound = true;
  }
};