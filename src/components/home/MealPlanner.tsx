import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Food {
  name: string;
  calories: number;
  protein: number;
  servingSize: string;
}

interface Meal {
  mealComponents: string[];
  mealCalories: number;
}

interface DayPlan {
  dailyMeals: Meal[];
  totalProtein: number;
  dayCalories: number;
}

const MealPlanner = () => {
  const [goalValue, setGoalValue] = useState<number>(2000);
  const [mealsPerDay, setMealsPerDay] = useState<number>(3);
  const [mealPlan, setMealPlan] = useState<DayPlan[]>([]);

  // Food data arrays
  const proteins: Food[] = [
    { name: "Chicken Breast", calories: 200, protein: 25, servingSize: "100g" },
    { name: "Salmon", calories: 233, protein: 25, servingSize: "100g" },
    { name: "Tofu", calories: 144, protein: 15, servingSize: "100g" },
    { name: "Beef", calories: 250, protein: 26, servingSize: "100g" },
  ];

  const carbs: Food[] = [
    { name: "Rice", calories: 205, protein: 4, servingSize: "1 cup cooked" },
    { name: "Pasta", calories: 220, protein: 7, servingSize: "1 cup cooked" },
    { name: "Sweet Potato", calories: 86, protein: 2, servingSize: "100g" },
  ];

  const fats: Food[] = [
    { name: "Avocado", calories: 234, protein: 3, servingSize: "1 medium" },
    { name: "Olive Oil", calories: 119, protein: 0, servingSize: "1 tbsp" },
    { name: "Nuts", calories: 170, protein: 6, servingSize: "1 oz" },
  ];

  const fruits: Food[] = [
    { name: "Apple", calories: 95, protein: 0, servingSize: "1 medium" },
    { name: "Banana", calories: 105, protein: 1, servingSize: "1 medium" },
    { name: "Orange", calories: 62, protein: 1, servingSize: "1 medium" },
    { name: "Berries", calories: 85, protein: 1, servingSize: "1 cup" },
  ];

  const salads: Food[] = [
    { name: "Mixed Green Salad", calories: 70, protein: 2, servingSize: "2 cups" },
    { name: "Caesar Salad", calories: 120, protein: 4, servingSize: "2 cups" },
    { name: "Greek Salad", calories: 150, protein: 3, servingSize: "2 cups" },
  ];

  const generateMealPlan = () => {
    const allFoods = [...proteins, ...carbs, ...fats, ...fruits, ...salads];
    let newMealPlan: DayPlan[] = [];

    for (let day = 0; day < 7; day++) {
      let dailyMeals: Meal[] = [];
      let dayCalories = 0;
      let totalProtein = 0;

      // Ensure at least one fruit and one salad per day
      let dailyFruit = fruits[Math.floor(Math.random() * fruits.length)];
      let dailySalad = salads[Math.floor(Math.random() * salads.length)];

      for (let meal = 0; meal < mealsPerDay; meal++) {
        let mealCalories = 0;
        let mealComponents: string[] = [];

        // Add fruit to first meal and salad to last meal of the day
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="p-6">
        <h2 className="text-2xl font-heading font-bold text-center mb-6">7-Day Meal Planner</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="calories">Daily Calorie Goal</Label>
            <Input
              id="calories"
              type="number"
              value={goalValue}
              onChange={(e) => setGoalValue(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="meals">Meals per Day</Label>
            <select
              id="meals"
              value={mealsPerDay}
              onChange={(e) => setMealsPerDay(Number(e.target.value))}
              className="w-full mt-1 p-2 rounded-md border border-input bg-background"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <Button onClick={generateMealPlan} className="flex-1">
              Generate Meal Plan
            </Button>
            {mealPlan.length > 0 && (
              <Button onClick={downloadMealPlan} variant="outline" className="flex-1">
                Download Plan
              </Button>
            )}
          </div>
        </div>

        {mealPlan.length > 0 && (
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
        )}
      </Card>
    </div>
  );
};

export default MealPlanner;