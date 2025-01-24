// src/components/SentryTest.tsx
import React from 'react';

const SentryTest: React.FC = () => {
  return (
    <button 
      onClick={() => {throw new Error("This is your first error!");}}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Break the world
    </button>
  );
};

export default SentryTest;
