import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const activities = {
  "Walking": {
    "low": 60, "moderate": 80, "high": 100
  },
  "Jogging": {
    "low": 150, "moderate": 180, "high": 200
  },
  "Running": {
    "low": 180, "moderate": 230, "high": 260
  },
  "Cycling": {
    "low": 120, "moderate": 160, "high": 220
  },
  "Swimming": {
    "low": 120, "moderate": 160, "high": 200
  },
  "Weightlifting": {
    "low": 70, "moderate": 90, "high": 120
  },
  "Rowing": {
    "low": 120, "moderate": 160, "high": 200
  },
  "Ice Skating": {
    "low": 100, "moderate": 140, "high": 180
  },
  "Snowboarding": {
    "low": 120, "moderate": 140, "high": 200
  },
  "Skateboarding": {
    "low": 100, "moderate": 120, "high": 180
  },
  "Rollerskating": {
    "low": 100, "moderate": 150, "high": 200
  },
  "Hiking": {
    "low": 120, "moderate": 160, "high": 200
  },
  "Skiing": {
    "low": 140, "moderate": 180, "high": 220
  },
  "Dancing": {
    "low": 80, "moderate": 100, "high": 140
  },
  "Romance": {
    "low": 50, "moderate": 60, "high": 100
  },
  "Rock Climbing": {
    "low": 140, "moderate": 180, "high": 220
  },
  "Wrestling": {
    "low": 140, "moderate": 180, "high": 220
  }
};

const CalorieBurner = () => {
  const [calories, setCalories] = useState<string>('');
  const [intensity, setIntensity] = useState<string>('moderate');
  const [time, setTime] = useState<string>('');
  const [results, setResults] = useState<Array<{ activity: string, value: string | number }>>([]);

  const calculateResults = () => {
    const caloriesNum = parseInt(calories);
    const timeNum = parseInt(time);
    let newResults: Array<{ activity: string, value: string | number }> = [];

    if (caloriesNum && intensity) {
      Object.entries(activities).forEach(([activity, intensityLevels]) => {
        const timeToBurn = Math.round(caloriesNum / intensityLevels[intensity as keyof typeof intensityLevels] * 20);
        newResults.push({ activity, value: `${timeToBurn} minutes` });
      });
    } else if (caloriesNum && timeNum) {
      Object.entries(activities).forEach(([activity, intensityLevels]) => {
        const intensityLevel = Object.keys(intensityLevels).find(
          level => intensityLevels[level as keyof typeof intensityLevels] >= caloriesNum / timeNum
        );
        newResults.push({ activity, value: intensityLevel || 'N/A' });
      });
    }

    setResults(newResults);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-7">
      <Card className="p-6">
        <h2 className="text-2xl font-heading font-bold text-center mb-6">
          How To Burn {calories || '___'} Calories
        </h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="calories">Enter the number of calories you want to burn:</Label>
            <Input
              id="calories"
              type="number"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="intensity">Choose the intensity level:</Label>
            <Select value={intensity} onValueChange={setIntensity}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select intensity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="time">Or enter the time in minutes:</Label>
            <Input
              id="time"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button onClick={calculateResults} className="w-full">
            Calculate
          </Button>
        </div>

        {results.length > 0 && (
          <div className="mt-6">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-border bg-secondary p-2 text-left">Activity</th>
                  <th className="border border-border bg-secondary p-2 text-left">
                    {time ? 'Intensity' : 'Time (minutes)'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map(({ activity, value }, index) => (
                  <tr key={index}>
                    <td className="border border-border p-2">{activity}</td>
                    <td className="border border-border p-2">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CalorieBurner;
