import React from 'react';
import { Cell } from './types';

interface GridProps {
  children: React.ReactNode;
}

const Grid = ({ children }: GridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 flex-1 w-full">
      {children}
    </div>
  );
};

export default Grid;