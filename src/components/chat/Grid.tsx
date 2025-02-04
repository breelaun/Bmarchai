import React from 'react';

interface GridProps {
  children: React.ReactNode;
  className?: string;
}

const Grid = ({ children, className = "" }: GridProps) => {
  return (
    <div className={`grid grid-cols-12 h-full ${className}`}>
      {children}
    </div>
  );
};

export default Grid;