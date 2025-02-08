import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { Category } from "./types";
import FavoriteCategories from "./FavoriteCategories";
import CategoriesDropdown from "./CategoriesDropdown";
 
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
  "Fitness and Workout Challenges",
  "Taekwondo"
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
        <FavoriteCategories
          categories={favoriteCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          onToggleFavorite={toggleFavorite}
        />
        <CategoriesDropdown
          categories={otherCategories}
          onCategoryChange={onCategoryChange}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
};

export default StreamFilters;
