import { useGame } from './GameContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const WordList = () => {
  const { words, foundWords } = useGame();

  const isWordFound = (word: string) => foundWords.includes(word);

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      <h3 className="text-lg font-semibold mb-2">Words to Find:</h3>
      <ScrollArea className="h-48 rounded-md border p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {words.map((word) => (
            <Button
              key={word}
              variant="ghost"
              className={`justify-start ${isWordFound(word) ? 'text-primary line-through' : ''}`}
              disabled={isWordFound(word)}
            >
              {word}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default WordList;