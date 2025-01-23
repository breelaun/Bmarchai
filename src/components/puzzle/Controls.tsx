import { Button } from "@/components/ui/button";
import { ControlsProps } from "./types";

const Controls = ({ onHint, onRiddle, onReveal, score, timer }: ControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={onHint}
          className="transition-transform hover:scale-105 active:scale-95"
        >
          Get Hint
        </Button>
        <Button 
          onClick={onRiddle}
          className="transition-transform hover:scale-105 active:scale-95"
        >
          Get Riddle
        </Button>
        <Button 
          onClick={onReveal}
          className="transition-transform hover:scale-105 active:scale-95"
        >
          Reveal Word
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-lg font-semibold">
          Score: {score}
        </div>
        <div className="text-lg">
          Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default Controls;