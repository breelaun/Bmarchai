const Controls = ({ onHint, onRiddle, onReveal, score, timer }) => (
  <div className="controls flex gap-4 items-center">
    <button className="btn" onClick={onHint}>
      Hint
    </button>
    <button className="btn" onClick={onRiddle}>
      Riddle
    </button>
    <button className="btn" onClick={onReveal}>
      Reveal Word
    </button>
    <div className="score">Score: {score}</div>
    <div className="timer">Time: {timer}s</div>
  </div>
);
export default Controls;
