import { Button } from "@/components/ui/button";

const Controls = ({ onHint, onRiddle, onReveal, score, timer }) => (
  <div className="controls flex flex-wrap gap-2 items-center justify-between bg-card p-4 rounded-lg shadow-sm">
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={onHint}>
        Hint
      </Button>
      <Button variant="outline" onClick={onRiddle}>
        Riddle
      </Button>
      <Button variant="outline" onClick={onReveal}>
        Reveal Word
      </Button>
    </div>
    <div className="flex gap-4 items-center text-sm md:text-base">
      <div className="score font-medium">Score: {score}</div>
      <div className="timer font-medium">Time: {timer}s</div>
    </div>
  </div>
);

export default Controls;