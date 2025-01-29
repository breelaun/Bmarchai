import { useGame } from './GameContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const Controls = () => {
  const { words, foundWords, setFoundWords, grid } = useGame();

  const handleRevealWord = () => {
    const remainingWords = words.filter(word => !foundWords.includes(word));
    if (remainingWords.length > 0) {
      const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
      setFoundWords([...foundWords, randomWord]);
      toast({
        title: "Word Revealed",
        description: `The word "${randomWord}" has been revealed!`,
      });
    }
  };

  const handleReset = () => {
    setFoundWords([]);
    toast({
      title: "Game Reset",
      description: "All progress has been cleared.",
    });
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4">
      <Button onClick={handleRevealWord}>Reveal Word</Button>
      <Button variant="outline" onClick={handleReset}>Reset Game</Button>
    </div>
  );
};

export default Controls;