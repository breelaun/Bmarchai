import React from 'react';
import { Cell } from './types';

interface GridProps {
  children: React.ReactNode;
}

const Grid = ({ children }: GridProps) => {
  return (
    <div className="grid grid-cols-12 h-full">
      {children}
    </div>
  );
};

export default Grid;