import { useState } from 'react';

type Direction = 'right' | 'left' | 'up' | 'down' | 'diagonal';

const TargetGame = () => {
  const [direction, setDirection] = useState<Direction>('right');
  
  const handleDirectionChange = (newDirection: Direction) => {
    setDirection(newDirection);
  };

  return (
    <div>
      <h1>Target Game</h1>
      <p>Current Direction: {direction}</p>
      <button onClick={() => handleDirectionChange('right')}>Right</button>
      <button onClick={() => handleDirectionChange('left')}>Left</button>
      <button onClick={() => handleDirectionChange('up')}>Up</button>
      <button onClick={() => handleDirectionChange('down')}>Down</button>
      <button onClick={() => handleDirectionChange('diagonal')}>Diagonal</button>
    </div>
  );
};

export default TargetGame;
