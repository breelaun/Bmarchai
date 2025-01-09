import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MealPlanControlsProps {
  goalValue: number;
  mealsPerDay: number;
  onGoalChange: (value: number) => void;
  onMealsPerDayChange: (value: number) => void;
  onGenerate: () => void;
  onDownload: () => void;
  onReset: () => void;
  showDownload: boolean;
}

const MealPlanControls = ({
  goalValue,
  mealsPerDay,
  onGoalChange,
  onMealsPerDayChange,
  onGenerate,
  onDownload,
  onReset,
  showDownload
}: MealPlanControlsProps) => {
  return (
    <div className="space-y-4 mb-6">
      <div>
        <Label htmlFor="calories">Daily Calorie Goal</Label>
        <Input
          id="calories"
          type="number"
          value={goalValue}
          onChange={(e) => onGoalChange(Number(e.target.value))}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="meals">Meals per Day</Label>
        <select
          id="meals"
          value={mealsPerDay}
          onChange={(e) => onMealsPerDayChange(Number(e.target.value))}
          className="w-full mt-1 p-2 rounded-md border border-input bg-background"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <Button onClick={onGenerate} className="flex-1">
          Generate Meal Plan
        </Button>
        {showDownload && (
          <Button onClick={onDownload} variant="outline" className="flex-1">
            Download Plan
          </Button>
        )}
      </div>
      
      <Button onClick={onReset} variant="secondary" className="w-full">
        Reset Planner
      </Button>
    </div>
  );
};

export default MealPlanControls;