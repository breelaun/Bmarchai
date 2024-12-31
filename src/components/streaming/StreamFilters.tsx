import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface StreamFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
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
  "Rowing"
];

const StreamFilters = ({ selectedCategory, onCategoryChange }: StreamFiltersProps) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          className="whitespace-nowrap"
          onClick={() => onCategoryChange(category === "All" ? null : category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default StreamFilters;