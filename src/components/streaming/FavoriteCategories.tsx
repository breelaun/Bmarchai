import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface FavoriteCategoriesProps {
  categories: Array<{ name: string; isFavorite: boolean }>;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onToggleFavorite: (categoryName: string) => void;
}

const FavoriteCategories = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onToggleFavorite,
}: FavoriteCategoriesProps) => {
  return (
    <>
      {categories.map((category) => (
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
              onToggleFavorite(category.name);
            }}
          />
        </Button>
      ))}
    </>
  );
};

export default FavoriteCategories;