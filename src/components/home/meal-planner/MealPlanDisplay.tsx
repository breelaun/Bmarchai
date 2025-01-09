import React from 'react';
import { Card } from "@/components/ui/card";

interface Meal {
  mealComponents: string[];
  mealCalories: number;
}

interface DayPlan {
  dailyMeals: Meal[];
  totalProtein: number;
  dayCalories: number;
}

interface MealPlanDisplayProps {
  mealPlan: DayPlan[];
  goalValue: number;
}

const MealPlanDisplay = ({ mealPlan, goalValue }: MealPlanDisplayProps) => {
  if (mealPlan.length === 0) return null;

  return (
    <div className="space-y-6">
      {mealPlan.map((day, dayIndex) => (
        <div key={dayIndex} className="p-4 rounded-lg bg-secondary">
          <h3 className="text-xl font-semibold mb-3">Day {dayIndex + 1}</h3>
          {day.dailyMeals.map((meal, mealIndex) => (
            <div key={mealIndex} className="mb-3">
              <p className="font-medium">Meal {mealIndex + 1}:</p>
              <p className="text-muted-foreground">{meal.mealComponents.join(', ')}</p>
              <p className="text-sm text-primary">Calories: {meal.mealCalories.toFixed(0)} kcal</p>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-border">
            <p>Total Protein: {day.totalProtein.toFixed(1)}g</p>
            <p>Total Calories: {day.dayCalories.toFixed(0)} kcal</p>
            <p className="text-sm text-muted-foreground">
              Goal Difference: {(day.dayCalories - goalValue).toFixed(0)} kcal
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MealPlanDisplay;