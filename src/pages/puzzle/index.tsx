import React from 'react';

const FitnessPuzzle = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Word Search</h1>
          <p className="text-muted-foreground">Find all the hidden words related to fitness and health</p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <div id="nextPuzzle" className="text-muted-foreground text-sm">Next puzzle in: </div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <div id="timer" className="text-muted-foreground text-sm">Time: 0s</div>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <div id="score" className="text-muted-foreground text-sm">Score: 500</div>
          </div>
        </div>

        {/* Game Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Grid */}
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div id="grid" className="flex flex-col items-center"></div>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Current Word */}
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Current Selection</h2>
              <div id="currentWord" className="text-2xl font-bold text-foreground">Current Word: </div>
            </div>

            {/* Word List */}
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold mb-4">Found Words</h2>
              <div id="foundWords" className="word-list"></div>
            </div>

            {/* Controls */}
            <div className="bg-card p-6 rounded-lg shadow-sm border space-y-4">
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
            </div>

            {/* Message */}
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div id="message" className="text-muted-foreground"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessPuzzle;