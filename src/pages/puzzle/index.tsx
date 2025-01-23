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

    // Word pool and definitions remain the same as in your original code
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
                    <CardTitle>Word Search Puzzle</CardTitle>
                    <Button 
                        onClick={() => setShowWords(!showWords)}
                        className="mt-2"
                    >
                        {showWords ? 'Hide Words' : 'Show Words'}
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <div 
                                className="grid grid-cols-15 gap-1 bg-card p-4 rounded-lg shadow-inner"
                                onMouseLeave={handleMouseUp}
                            >
                                {grid.map((row, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                        {row.map((cell) => (
                                            <div
                                                key={`${cell.row}-${cell.col}`}
                                                className={`
                                                    cell
                                                    ${cell.isSelected ? 'selected' : ''}
                                                    ${cell.isFound ? 'found' : ''}
                                                `}
                                                onMouseDown={() => handleMouseDown(cell)}
                                                onMouseEnter={() => handleMouseEnter(cell)}
                                                onMouseUp={handleMouseUp}
                                            >
                                                {cell.text}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {showWords && (
                            <div className="flex-none w-full lg:w-64 space-y-4">
                                <div className="bg-card p-4 rounded-lg shadow">
                                    <h3 className="font-semibold mb-2">Words to Find:</h3>
                                    <ul className="space-y-1">
                                        {wordPool.map((word) => (
                                            <li
                                                key={word}
                                                className={`${
                                                    foundWords.includes(word) ? 'line-through text-muted-foreground' : ''
                                                }`}
                                            >
                                                {word}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <style jsx>{`
                .grid-cols-15 {
                    grid-template-columns: repeat(15, minmax(0, 1fr));
                }

                .cell {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    background-color: hsl(var(--card));
                    border: 2px solid hsl(var(--border));
                    border-radius: 0.5rem;
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.2s ease;
                }

                .cell.selected {
                    background-color: hsl(var(--primary));
                    color: hsl(var(--primary-foreground));
                }

                .cell.found {
                    background-color: hsl(var(--success));
                    color: hsl(var(--success-foreground));
                }

                @media (max-width: 640px) {
                    .cell {
                        width: 30px;
                        height: 30px;
                        font-size: 0.875rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default WordSearch;
