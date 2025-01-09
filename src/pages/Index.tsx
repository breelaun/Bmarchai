import React from 'react';
import MealPlanner from '@/components/home/meal-planner/MealPlanner';
import CalorieBurner from '@/components/home/CalorieBurner';

const Index = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <MealPlanner />
      <CalorieBurner />
    </div>
  );
};

export default Index;