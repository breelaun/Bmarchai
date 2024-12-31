import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Star, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "./types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StreamFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const allCategories = [
  "All",
  "Pickleball",
  "Figure Skating",
  "Table Tennis",
  "Archery",
  "Ultimate Frisbee",
  "Rock Climbing",
  "Badminton",
  "Fencing",
  "Cricket",
  "Rugby",
  "Volleyball",
  "Skateboarding",
  "Surfing",
  "Rowing",
  "Yoga",
  "Pilates",
  "Dance",
  "Bodyweight",
  "HIIT",
  "Swimming",
  "Polo",
  "Speed Skating",
  "eSports",
  "Tennis",
  "Baseball",
  "Ironman",
  "Triathlons",
  "Gymnastics",
  "Football",
  "Crossfit",
  "Ballet",
  "Horse Racing",
  "Squash",
  "NASCAR",
  "Formula 1",
  "Soccer",
  "Roller Derby",
  "Lacrosse",
  "Hockey",
  "GDFL",
  "Airball",
  "Floorball",
  "Opera",
  "Theatre",
  "Broadway",
  "Martial Arts",
  "Climbing Competition",
  "Niche Sports",
  "Extreme Sports",
  "Live Training Camps",
  "Fantasy Sports Analytics",
  "Fitness and Workout Challenges"
].sort();

const StreamFilters = ({ selectedCategory, onCategoryChange }: StreamFiltersProps) => {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("favoriteCategories");
    if (saved) {
      return JSON.parse(saved);
    }
    return allCategories.map(cat => ({ name: cat, isFavorite: false }));
  });

  const favoriteCategories = categories.filter(cat => cat.isFavorite);
  const otherCategories = categories.filter(cat => !cat.isFavorite);

  useEffect(() => {
    localStorage.setItem("favoriteCategories", JSON.stringify(categories));
  }, [categories]);

  const toggleFavorite = (categoryName: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.name === categoryName ? { ...cat, isFavorite: !cat.isFavorite } : cat
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        {favoriteCategories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => onCategoryChange(category.name === "All" ? null : category.name)}
          >
            <span>{category.name}</span>
            <Star
              className="ml-1 h-3 w-3 fill-current"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(category.name);
              }}
            />
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              More Categories <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="w-56 bg-background border-border/50"
          >
            <ScrollArea className="h-[300px]">
              {otherCategories.map((category) => (
                <DropdownMenuItem
                  key={category.name}
                  className="flex items-center justify-between hover:bg-muted"
                  onClick={() => {
                    onCategoryChange(category.name === "All" ? null : category.name);
                  }}
                >
                  <span>{category.name}</span>
                  <Star
                    className={`ml-2 h-4 w-4 cursor-pointer ${
                      category.isFavorite ? "fill-primary" : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(category.name);
                    }}
                  />
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default StreamFilters;