import { Button } from "@/components/ui/button";
import { ChevronDown, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoriesDropdownProps {
  categories: Array<{ name: string; isFavorite: boolean }>;
  onCategoryChange: (category: string | null) => void;
  onToggleFavorite: (categoryName: string) => void;
}

const CategoriesDropdown = ({
  categories,
  onCategoryChange,
  onToggleFavorite,
}: CategoriesDropdownProps) => {
  return (
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
          {categories.map((category) => (
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
                  onToggleFavorite(category.name);
                }}
              />
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesDropdown;