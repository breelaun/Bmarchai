import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";

const FitnessPuzzle = () => {
  useEffect(() => {
    // Initialize puzzle game
    const script = document.createElement('script');
    script.innerHTML = `
      const wordPool = [
        "ENDURANCE", "STRENGTH", "CARDIO", "FLEXIBILITY", "NUTRITION",
        "MUSCLES", "WORKOUT", "FITNESS", "HEALTH", "PROTEIN",
        "VITAMINS", "MINERALS"
      ];

      const definitionPool = {
        "ENDURANCE": "The ability to sustain prolonged physical or mental effort.",
        "STRENGTH": "The capacity of an object or substance to withstand great force or pressure.",
        "CARDIO": "Exercise that raises your heart rate and improves the function of your heart and blood vessels.",
        "FLEXIBILITY": "The quality of bending easily without breaking.",
        "NUTRITION": "The process of providing or obtaining the food necessary for health and growth.",
        "MUSCLES": "A band or bundle of fibrous tissue in a human or animal body that has the ability to contract.",
        "WORKOUT": "A session of vigorous physical exercise or training.",
        "FITNESS": "The condition of being physically fit and healthy.",
        "HEALTH": "The state of being free from illness or injury.",
        "PROTEIN": "A nutrient essential for building and repairing tissues in the body.",
        "VITAMINS": "Organic compounds essential for normal growth and nutrition.",
        "MINERALS": "Inorganic substances required as an essential nutrient by organisms to perform functions necessary for life."
      };

      const riddlePool = {
        "ENDURANCE": "I'm not a race, but I'll help you pace. The longer you go, the stronger I grow. What am I?",
        "STRENGTH": "I'm not might, but I give you fight. Lift me up, and I'll make you tough. What am I?",
        "CARDIO": "I make your heart beat and your feet fleet. Run or dance, I'll give you a chance. What am I?",
        "FLEXIBILITY": "Bend me, stretch me, I won't break. The more you use me, the more I'll take. What am I?",
        "NUTRITION": "I'm not a doctor, but I help you heal. I'm on your plate, in every meal. What am I?",
        "MUSCLES": "We're a team that helps you gleam. Flex us right, we'll show our might. What are we?",
        "WORKOUT": "I'm a session full of action. Sweat and strain for satisfaction. What am I?",
        "FITNESS": "I'm a state you want to achieve. Exercise and diet, in me you'll believe. What am I?",
        "HEALTH": "I'm wealth without the money. Keep me good, and life is sunny. What am I?",
        "PROTEIN": "I'm the builder in your food. Eat me right, and I'll improve your mood. What am I?",
        "VITAMINS": "We're tiny helpers, A to Z. Fruits and veggies set us free. What are we?",
        "MINERALS": "In rocks and foods, we play our parts. We're essential for healthy hearts. What are we?"
      };

      const words = [];
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
        const selectedWords = wordPool.slice(0, 10); // Get first 10 words
        selectedWords.forEach(word => {
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
              words.push(word);
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
        for (let i = 0; i < gridSize; i++) {
          const row = document.createElement("div");
          row.className = "flex";
          for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.textContent = grid[i][j];
            cell.onclick = () => selectCell(i, j);
            row.appendChild(cell);
          }
          gridElement.appendChild(row);
        }
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
              <div id="grid" className="grid grid-cols-10 gap-1"></div>
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
