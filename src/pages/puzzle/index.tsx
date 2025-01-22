import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";

const FitnessPuzzle = () => {
  useEffect(() => {
    // Initialize puzzle game
    const script = document.createElement('script');
    script.innerHTML = `
      const words = ["FITNESS", "HEALTH", "EXERCISE", "YOGA", "DIET", "NUTRITION"];
      const gridSize = 10;
      const grid = [];
      const foundWords = [];
      const currentWordElement = document.getElementById("currentWord");
      const foundWordsElement = document.getElementById("foundWords");
      const gridElement = document.getElementById("grid");

      function createGrid() {
        for (let i = 0; i < gridSize; i++) {
          grid[i] = [];
          for (let j = 0; j < gridSize; j++) {
            grid[i][j] = "";
          }
        }
      }

      function placeWords() {
        words.forEach(word => {
          let placed = false;
          while (!placed) {
            const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            const row = Math.floor(Math.random() * gridSize);
            const col = Math.floor(Math.random() * gridSize);
            if (canPlaceWord(word, row, col, direction)) {
              for (let i = 0; i < word.length; i++) {
                if (direction === 'horizontal') {
                  grid[row][col + i] = word[i];
                } else {
                  grid[row + i][col] = word[i];
                }
              }
              placed = true;
            }
          }
        });
      }

      function canPlaceWord(word, row, col, direction) {
        if (direction === 'horizontal' && col + word.length > gridSize) return false;
        if (direction === 'vertical' && row + word.length > gridSize) return false;
        for (let i = 0; i < word.length; i++) {
          if (direction === 'horizontal' && grid[row][col + i] !== "") return false;
          if (direction === 'vertical' && grid[row + i][col] !== "") return false;
        }
        return true;
      }

      function fillEmptySpaces() {
        for (let i = 0; i < gridSize; i++) {
          for (let j = 0; j < gridSize; j++) {
            if (grid[i][j] === "") {
              grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
          }
        }
      }

      function renderGrid() {
        gridElement.innerHTML = "";
        grid.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            const cellElement = document.createElement("div");
            cellElement.className = "cell";
            cellElement.innerText = cell;
            cellElement.onclick = () => selectCell(rowIndex, colIndex);
            gridElement.appendChild(cellElement);
          });
        });
      }

      function selectCell(row, col) {
        const cell = grid[row][col];
        if (currentWordElement.innerText.includes(cell)) {
          currentWordElement.innerText = currentWordElement.innerText.replace(cell, "");
          foundWords.push(cell);
          foundWordsElement.innerText = foundWords.join(", ");
          renderGrid();
        } else {
          currentWordElement.innerText += cell;
        }
      }

      createGrid();
      placeWords();
      fillEmptySpaces();
      renderGrid();
    `;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Word Search</h1>
          <p className="text-muted-foreground">Find all the hidden words related to fitness and health</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div id="nextPuzzle" className="text-muted-foreground text-sm">Next puzzle in: </div>
          </Card>
          <Card className="p-4">
            <div id="timer" className="text-muted-foreground text-sm">Time: 0s</div>
          </Card>
          <Card className="p-4">
            <div id="score" className="text-muted-foreground text-sm">Score: 500</div>
          </Card>
        </div>

        {/* Game Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grid */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div id="grid" className="flex flex-col items-center"></div>
            </Card>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Current Word */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Current Selection</h2>
              <div id="currentWord" className="text-2xl font-bold text-foreground">Current Word: </div>
            </Card>

            {/* Word List */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Found Words</h2>
              <div id="foundWords" className="word-list"></div>
            </Card>

            {/* Controls */}
            <Card className="p-6 space-y-4">
              <input 
                type="text" 
                id="wordInput" 
                placeholder="Enter word" 
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <button id="submitWordBtn" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition">
                  Submit Word
                </button>
                <button id="hintBtn" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                  Hint
                </button>
                <button id="riddleBtn" className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition">
                  Riddle
                </button>
                <button id="showWordBtn" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
                  Show Word
                </button>
              </div>
            </Card>

            {/* Message */}
            <Card className="p-6">
              <div id="message" className="text-muted-foreground"></div>
            </Card>
          </div>
        </div>
      </div>

      <style>
        {`
        .cell {
          width: 40px;
          height: 40px;
          border: 1px solid hsl(var(--border));
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
          background-color: hsl(var(--background));
          border-radius: 4px;
          margin: 2px;
        }
        .cell:hover {
          background-color: hsl(var(--accent));
          transform: scale(1.05);
        }
        .selected {
          background-color: hsl(var(--primary)) !important;
          border-color: hsl(var(--primary));
          color: hsl(var(--primary-foreground));
        }
        .found {
          background-color: hsl(var(--success)) !important;
          border-color: hsl(var(--success));
          color: hsl(var(--success-foreground));
        }
        .highlighted {
          background-color: hsl(var(--warning)) !important;
          border-color: hsl(var(--warning));
          color: hsl(var(--warning-foreground));
        }
        .word-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .word-item {
          padding: 6px 12px;
          background-color: hsl(var(--background));
          border-radius: 16px;
          font-size: 0.9rem;
          border: 1px solid hsl(var(--border));
        }
        .word-found {
          background-color: hsl(var(--success));
          border-color: hsl(var(--success));
          color: hsl(var(--success-foreground));
        }
        `}
      </style>
    </div>
  );
};

export default FitnessPuzzle;