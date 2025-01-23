import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Cell {
    text: string;
    row: number;
    col: number;
    isSelected: boolean;
    isFound: boolean;
    isHighlighted: boolean;
}

const WordSearch: React.FC = () => {
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [score, setScore] = useState<number>(500);
    const [timer, setTimer] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [showWords, setShowWords] = useState<boolean>(true);
    const [dragStart, setDragStart] = useState<Cell | null>(null);
    const [currentSelection, setCurrentSelection] = useState<Cell[]>([]);
    const [currentWord, setCurrentWord] = useState<string>('');

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

    const initGame = useCallback(() => {
        const grid = createInitialGrid();
        placeWordsInGrid(grid, wordPool);
        fillEmptyCells(grid);
        setGrid(grid);
        setScore(500);
        setTimer(0);
        setFoundWords([]);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const createInitialGrid = (): Cell[][] => {
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

    const toggleCell = (cell: Cell) => {
        if (cell.isFound) return;

        const newGrid = grid.map(row => [...row]);
        const cellToToggle = newGrid[cell.row][cell.col];

        if (selectedCells.length > 0) {
            const lastCell = selectedCells[selectedCells.length - 1];
            const rowDiff = Math.abs(lastCell.row - cell.row);
            const colDiff = Math.abs(lastCell.col - cell.col);
            
            if (rowDiff > 1 || colDiff > 1) {
                return;
            }
        }

        cellToToggle.isSelected = !cellToToggle.isSelected;
        setGrid(newGrid);

        if (cellToToggle.isSelected) {
            setSelectedCells([...selectedCells, cellToToggle]);
        } else {
            setSelectedCells(selectedCells.filter(c => 
                c.row !== cell.row || c.col !== cell.col
            ));
        }

        setCurrentWord(selectedCells.map(c => c.text).join(''));
    };

    const handleMouseDown = (cell: Cell) => {
        setDragStart(cell);
        setCurrentSelection([cell]);
        updateGridSelection([cell]);
    };

    const handleMouseEnter = (cell: Cell) => {
        if (dragStart && isValidNextCell(cell, currentSelection)) {
            const newSelection = [...currentSelection, cell];
            setCurrentSelection(newSelection);
            updateGridSelection(newSelection);
        }
    };

    const handleMouseUp = () => {
        const selectedWord = currentSelection.map(cell => cell.text).join('');
        if (wordPool.includes(selectedWord) && !foundWords.includes(selectedWord)) {
            setFoundWords([...foundWords, selectedWord]);
            markWordAsFound(currentSelection);
            setScore(score + 100);
        }
        setDragStart(null);
        setCurrentSelection([]);
        clearGridSelection();
    };

    const isValidNextCell = (cell: Cell, currentCells: Cell[]): boolean => {
        if (currentCells.length === 0) return true;
        const lastCell = currentCells[currentCells.length - 1];
        const rowDiff = Math.abs(cell.row - lastCell.row);
        const colDiff = Math.abs(cell.col - lastCell.col);
        return (rowDiff <= 1 && colDiff <= 1) && !currentCells.includes(cell);
    };

    const updateGridSelection = (selectedCells: Cell[]) => {
        const newGrid = grid.map(row => row.map(cell => ({
            ...cell,
            isSelected: selectedCells.some(selected => 
                selected.row === cell.row && selected.col === cell.col
            )
        })));
        setGrid(newGrid);
    };

    const clearGridSelection = () => {
        const newGrid = grid.map(row => row.map(cell => ({
            ...cell,
            isSelected: false
        })));
        setGrid(newGrid);
    };

    const markWordAsFound = (cells: Cell[]) => {
        const newGrid = grid.map(row => row.map(cell => ({
            ...cell,
            isFound: cell.isFound || cells.some(foundCell => 
                foundCell.row === cell.row && foundCell.col === cell.col
            )
        })));
        setGrid(newGrid);
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Word Search Puzzle</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-15 gap-1 bg-card p-4 rounded-lg shadow-inner">
                        {grid.map((row, rowIndex) => (
                            <React.Fragment key={rowIndex}>
                                {row.map((cell) => (
                                    <button
                                        key={`${cell.row}-${cell.col}`}
                                        onClick={() => toggleCell(cell)}
                                        className={`
                                            w-8 h-8 sm:w-10 sm:h-10 
                                            flex items-center justify-center 
                                            rounded-md font-bold text-sm sm:text-base
                                            transition-all duration-200 transform
                                            ${cell.isFound ? 'bg-green-500 text-white scale-95' : ''}
                                            ${cell.isSelected ? 'bg-primary text-primary-foreground scale-105' : 'bg-card hover:bg-muted'}
                                            ${!cell.isFound && !cell.isSelected ? 'hover:scale-105' : ''}
                                            active:scale-95
                                        `}
                                        disabled={cell.isFound}
                                    >
                                        {cell.text}
                                    </button>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {wordPool.map((word) => (
                                <div
                                    key={word}
                                    className={`
                                        px-3 py-1 rounded-full text-sm
                                        transition-all duration-300 transform
                                        ${foundWords.includes(word) 
                                            ? 'bg-green-500 text-white scale-95' 
                                            : 'bg-secondary text-secondary-foreground'}
                                        ${foundWords.includes(word) ? 'animate-[scale-95_0.2s_ease-in-out]' : ''}
                                    `}
                                >
                                    {word}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                            <Button 
                                onClick={giveHint}
                                className="transition-transform hover:scale-105 active:scale-95"
                            >
                                Get Hint
                            </Button>
                            <Button 
                                onClick={giveRiddle}
                                className="transition-transform hover:scale-105 active:scale-95"
                            >
                                Get Riddle
                            </Button>
                            <Button 
                                onClick={showWord}
                                className="transition-transform hover:scale-105 active:scale-95"
                            >
                                Reveal Word
                            </Button>
                        </div>

                        {message && (
                            <div className="bg-muted p-4 rounded-lg animate-[fade-in_0.3s_ease-out]">
                                {message}
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <div className="text-lg font-semibold">
                                Score: {score}
                            </div>
                            <div className="text-lg">
                                Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <style jsx>{`
                .grid-cols-15 {
                    grid-template-columns: repeat(15, minmax(0, 1fr));
                }

                @keyframes scale-95 {
                    0% { transform: scale(1); }
                    50% { transform: scale(0.95); }
                    100% { transform: scale(1); }
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default WordSearch;
