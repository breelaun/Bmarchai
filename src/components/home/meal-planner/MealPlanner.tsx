import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import MealPlanControls from './MealPlanControls';
import MealPlanDisplay from './MealPlanDisplay';
import { proteins, salads, carbs, fats, fruits, type Food } from './FoodData';

interface Meal {
  mealComponents: string[];
  mealCalories: number;
}

interface DayPlan {
  dailyMeals: Meal[];
  totalProtein: number;
  dayCalories: number;
}

const DEFAULT_GOAL = 2000;
const DEFAULT_MEALS = 3;

const MealPlanner = () => {
  const [goalValue, setGoalValue] = useState<number>(DEFAULT_GOAL);
  const [mealsPerDay, setMealsPerDay] = useState<number>(DEFAULT_MEALS);
  const [mealPlan, setMealPlan] = useState<DayPlan[]>([]);

  const generateMealPlan = () => {
    const allFoods = [...proteins, ...carbs, ...fats, ...fruits, ...salads];
    let newMealPlan: DayPlan[] = [];

    for (let day = 0; day < 7; day++) {
      let dailyMeals: Meal[] = [];
      let dayCalories = 0;
      let totalProtein = 0;

      let dailyFruit = fruits[Math.floor(Math.random() * fruits.length)];
      let dailySalad = salads[Math.floor(Math.random() * salads.length)];

      for (let meal = 0; meal < mealsPerDay; meal++) {
        let mealCalories = 0;
        let mealComponents: string[] = [];

        if (meal === 0) {
          mealCalories += dailyFruit.calories;
          totalProtein += dailyFruit.protein;
          mealComponents.push(`${dailyFruit.name} (${dailyFruit.servingSize})`);
        }

        if (meal === mealsPerDay - 1) {
          mealCalories += dailySalad.calories;
          totalProtein += dailySalad.protein;
          mealComponents.push(`${dailySalad.name} (${dailySalad.servingSize})`);
        }

        while (mealCalories < (goalValue / mealsPerDay)) {
          const food = allFoods[Math.floor(Math.random() * allFoods.length)];
          mealCalories += food.calories;
          totalProtein += food.protein;
          mealComponents.push(`${food.name} (${food.servingSize})`);

          if (mealCalories >= (goalValue / mealsPerDay)) break;
        }

        dayCalories += mealCalories;
        dailyMeals.push({ mealComponents, mealCalories });
      }

      newMealPlan.push({ dailyMeals, totalProtein, dayCalories });
    }

    setMealPlan(newMealPlan);
  };

  const downloadMealPlan = () => {
    let content = "7-Day Meal Plan\n\n";
    mealPlan.forEach((day, dayIndex) => {
      content += `Day ${dayIndex + 1}\n`;
      day.dailyMeals.forEach((meal, mealIndex) => {
        content += `Meal ${mealIndex + 1}: ${meal.mealComponents.join(', ')}\n`;
        content += `Calories: ${meal.mealCalories} kcal\n`;
      });
      content += `Total Protein: ${day.totalProtein.toFixed(1)}g\n`;
      content += `Total Calories: ${day.dayCalories.toFixed(0)} kcal\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meal_plan.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetPlanner = () => {
    setGoalValue(DEFAULT_GOAL);
    setMealsPerDay(DEFAULT_MEALS);
    setMealPlan([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-heading font-bold text-center mb-6">7-Day Meal Planner</h2>
        
        <MealPlanControls
          goalValue={goalValue}
          mealsPerDay={mealsPerDay}
          onGoalChange={setGoalValue}
          onMealsPerDayChange={setMealsPerDay}
          onGenerate={generateMealPlan}
          onDownload={downloadMealPlan}
          onReset={resetPlanner}
          showDownload={mealPlan.length > 0}
        />

        <MealPlanDisplay 
          mealPlan={mealPlan}
          goalValue={goalValue}
        />
      </Card>
    </div>
  );
};

export default MealPlanner;