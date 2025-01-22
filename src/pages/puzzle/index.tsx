import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Cell {
    text: string;
    row: number;
    col: number;
    isSelected: boolean;
    isFound: boolean;
    isHighlighted: boolean;
}

interface Direction {
    rowDelta: number;
    colDelta: number;
}

interface Definition {
    [key: string]: string;
}

interface Riddle {
    [key: string]: string;
}

const WordSearch: React.FC = () => {
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [score, setScore] = useState<number>(500);
    const [timer, setTimer] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [currentWord, setCurrentWord] = useState<string>('');
    const [nextPuzzleTime, setNextPuzzleTime] = useState<Date>(new Date());
    const [inputWord, setInputWord] = useState<string>('');

    const wordPool = [
        "ENDURANCE", "STRENGTH", "CARDIO", "FLEXIBILITY", "NUTRITION",
        "MUSCLES", "WORKOUT", "FITNESS", "HEALTH", "PROTEIN",
        "VITAMINS", "MINERALS"
    ];

    const definitionPool: Definition = {
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

    const riddlePool: Riddle = {
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

    const [words, setWords] = useState<string[]>([]);
    const [definitions, setDefinitions] = useState<Definition>({});
    const [riddles, setRiddles] = useState<Riddle>({});

    const getDirections = (): Direction[] => [
        { rowDelta: 0, colDelta: 1 },    // right
        { rowDelta: 1, colDelta: 0 },    // down
        { rowDelta: 1, colDelta: 1 },    // diagonal down-right
        { rowDelta: 1, colDelta: -1 },   // diagonal down-left
        { rowDelta: 0, colDelta: -1 },   // left
        { rowDelta: -1, colDelta: 0 },   // up
        { rowDelta: -1, colDelta: 1 },   // diagonal up-right
        { rowDelta: -1, colDelta: -1 }   // diagonal up-left
    ];

    const selectRandomWords = () => {
        const shuffled = [...wordPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10);
    };

    const generateDefinitionsAndRiddles = (selectedWords: string[]) => {
        const newDefinitions: Definition = {};
        const newRiddles: Riddle = {};
        selectedWords.forEach(word => {
            newDefinitions[word] = definitionPool[word];
            newRiddles[word] = riddlePool[word];
        });
        return { newDefinitions, newRiddles };
    };

    const createEmptyGrid = (): Cell[][] => {
        return Array(15).fill(null).map((_, row) =>
            Array(15).fill(null).map((_, col) => ({
                text: '-',
                row,
                col,
                isSelected: false,
                isFound: false,
                isHighlighted: false
            }))
        );
    };

    const canPlaceWord = (
        word: string,
        startRow: number,
        startCol: number,
        direction: Direction,
        currentGrid: Cell[][]
    ): boolean => {
        const { rowDelta, colDelta } = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = startRow + (rowDelta * i);
            const newCol = startCol + (colDelta * i);
            
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
                return false;
            }
            
            const currentCell = currentGrid[newRow][newCol].text;
            if (currentCell !== '-' && currentCell !== word[i]) {
                return false;
            }
        }
        return true;
    };

    const placeWord = (
        word: string,
        startRow: number,
        startCol: number,
        direction: Direction,
        currentGrid: Cell[][]
    ): Cell[][] => {
        const newGrid = currentGrid.map(row => [...row]);
        const { rowDelta, colDelta } = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = startRow + (rowDelta * i);
            const newCol = startCol + (colDelta * i);
            newGrid[newRow][newCol].text = word[i];
        }
        
        return newGrid;
    };

    const placeWords = (selectedWords: string[]): Cell[][] => {
        let currentGrid = createEmptyGrid();
        const directions = getDirections();
        
        selectedWords.forEach(word => {
            let placed = false;
            let attempts = 0;
            const maxAttempts = 100;
            
            while (!placed && attempts < maxAttempts) {
                const row = Math.floor(Math.random() * 15);
                const col = Math.floor(Math.random() * 15);
                const direction = directions[Math.floor(Math.random() * directions.length)];
                
                if (canPlaceWord(word, row, col, direction, currentGrid)) {
                    currentGrid = placeWord(word, row, col, direction, currentGrid);
                    placed = true;
                }
                attempts++;
            }
            
            if (!placed) {
                console.warn(`Failed to place word: ${word}`);
            }
        });
        
        // Fill empty cells with random letters
        currentGrid = currentGrid.map(row =>
            row.map(cell => ({
                ...cell,
                text: cell.text === '-' ? 
                    String.fromCharCode(65 + Math.floor(Math.random() * 26)) : cell.text
            }))
        );
        
        return currentGrid;
    };

    const initGame = useCallback(() => {
        const selectedWords = selectRandomWords();
        const { newDefinitions, newRiddles } = generateDefinitionsAndRiddles(selectedWords);
        
        setWords(selectedWords);
        setDefinitions(newDefinitions);
        setRiddles(newRiddles);
        setGrid(placeWords(selectedWords));
        setSelectedCells([]);
        setFoundWords([]);
        setScore(500);
        setTimer(0);
        setMessage('');
        setCurrentWord('');
        setInputWord('');
        
        // Set next puzzle time
        const nextTime = new Date(Math.ceil(new Date().getTime() / (4 * 60 * 60 * 1000)) * (4 * 60 * 60 * 1000));
        setNextPuzzleTime(nextTime);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            if (now >= nextPuzzleTime) {
                initGame();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [nextPuzzleTime, initGame]);

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

    const checkWord = (word: string): boolean => {
        return words.includes(word) && !foundWords.includes(word);
    };

    const processWord = (word: string) => {
        word = word.toUpperCase();
        if (checkWord(word)) {
            setFoundWords([...foundWords, word]);
            setMessage(`Found "${word}"!\n${definitions[word]}`);
            
            // Mark word as found in grid
            const newGrid = highlightFoundWord(word, grid);
            setGrid(newGrid);
            
            if (foundWords.length + 1 === words.length) {
                endGame();
            }
        } else {
            setMessage('Word not found. Try again!');
            setScore(prevScore => prevScore - 50);
        }
        
        // Reset selections
        setSelectedCells([]);
        setInputWord('');
        setCurrentWord('');
    };

    const highlightFoundWord = (word: string, currentGrid: Cell[][]): Cell[][] => {
        const directions = getDirections();
        const newGrid = currentGrid.map(row => row.map(cell => ({ ...cell })));
        
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 15; col++) {
                if (newGrid[row][col].text === word[0]) {
                    for (const direction of directions) {
                        if (checkWordFromPosition(word, row, col, direction, newGrid)) {
                            markWordAsFound(word, row, col, direction, newGrid);
                            return newGrid;
                        }
                    }
                }
            }
        }
        
        return newGrid;
    };

    const checkWordFromPosition = (
        word: string,
        startRow: number,
        startCol: number,
        direction: Direction,
        currentGrid: Cell[][]
    ): boolean => {
        const { rowDelta, colDelta } = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = startRow + (rowDelta * i);
            const newCol = startCol + (colDelta * i);
            
            if (newRow < 0 || newRow >= 15 || newCol < 0 || newCol >= 15) {
                return false;
            }
            
            if (currentGrid[newRow][newCol].text !== word[i]) {
                return false;
            }
        }
        return true;
    };

    const markWordAsFound = (
        word: string,
        startRow: number,
        startCol: number,
        direction: Direction,
        currentGrid: Cell[][]
    ) => {
        const { rowDelta, colDelta } = direction;
        
        for (let i = 0; i < word.length; i++) {
            const newRow = startRow + (rowDelta * i);
            const newCol = startCol + (colDelta * i);
            currentGrid[newRow][newCol].isFound = true;
        }
    };

    const giveHint = () => {
        const remainingWords = words.filter(word => !foundWords.includes(word));
        if (remainingWords.length > 0) {
            const word = remainingWords[Math.floor(Math.random() * remainingWords.length)];
            setMessage(`Hint: ${definitions[word]}`);
            setScore(prevScore => prevScore - 25);
        } else {
            setMessage('All words found!');
        }
    };

    const giveRiddle = () => {
        const remainingWords = words.filter(word => !foundWords.includes(word));
        if (remainingWords.length > 0) {
            const word = remainingWords[Math.floor(Math.random() * remainingWords.length)];
            setMessage(`Riddle: ${riddles[word]}`);
            setScore(prevScore => prevScore - 25);
        } else {
            setMessage('All words found!');
        }
    };

    const showWord = () => {
        const remainingWords = words.filter(word => !foundWords.includes(word));
        if (remainingWords.length > 0) {
            const word = remainingWords[Math.floor(Math.random() * remainingWords.length)];
            setFoundWords([...foundWords, word]);
            const newGrid = highlightFoundWord(word, grid);
            setGrid(newGrid);
            setMessage(`Word revealed: ${word}`);
            setScore(prevScore => prevScore - 100); // Penalty for revealing a word
        }
    };

    const endGame = () => {
        setMessage('Congratulations! You found all the words!');
        // Additional end game logic can be added here
    };

    return (
        <div className="container mx-auto p-4">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle>Fitness Word Search Puzzle</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="flex-1">
                            <div className="grid grid-cols-15 gap-1 bg-card p-4 rounded-lg shadow-inner">
                                {grid.map((row, rowIndex) => (
                                    <React.Fragment key={rowIndex}>
                                        {row.map((cell) => (
                                            <div
                                                key={`${cell.row}-${cell.col}`}
                                                className={`cell ${
                                                    cell.isSelected ? 'selected' : ''
                                                } ${
                                                    cell.isFound ? 'found' : ''
                                                } ${
                                                    cell.isHighlighted ? 'highlighted' : ''
                                                }`}
                                                onClick={() => toggleCell(cell)}
                                            >
                                                {cell.text}
                                            </div>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        <div className="flex-none w-full lg:w-64 space-y-4">
                            <div className="bg-card p-4 rounded-lg shadow">
                                <h3 className="font-semibold mb-2">Score: {score}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                </p>
                            </div>

                            <div className="bg-card p-4 rounded-lg shadow">
                                <h3 className="font-semibold mb-2">Words to Find:</h3>
                                <ul className="space-y-1">
                                    {words.map((word) => (
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

                            <div className="space-y-2">
                                <button
                                    onClick={giveHint}
                                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                                >
                                    Get Hint (-25 points)
                                </button>
                                <button
                                    onClick={giveRiddle}
                                    className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                                >
                                    Get Riddle (-25 points)
                                </button>
                            </div>

                            {message && (
                                <div className="bg-card p-4 rounded-lg shadow">
                                    <p className="text-sm">{message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <style>{`
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

                .cell:hover {
                    background-color: hsl(var(--accent));
                    color: hsl(var(--accent-foreground));
                }

                .cell.selected {
                    background-color: hsl(var(--primary));
                    color: hsl(var(--primary-foreground));
                    border-color: hsl(var(--primary));
                }

                .cell.found {
                    background-color: hsl(var(--success));
                    border-color: hsl(var(--success));
                    color: hsl(var(--success-foreground));
                }

                .cell.highlighted {
                    background-color: hsl(var(--success));
                    border-color: hsl(var(--success));
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