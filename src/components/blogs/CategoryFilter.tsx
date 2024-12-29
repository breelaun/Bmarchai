import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory?: string;
}

const CategoryFilter = ({ categories, selectedCategory }: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Link to="/blogs">
        <Badge variant={!selectedCategory ? "default" : "outline"} className="cursor-pointer">
          All
        </Badge>
      </Link>
      {categories.map((category) => (
        <Link key={category} to={`/blogs/category/${category.toLowerCase()}`}>
          <Badge
            variant={selectedCategory === category.toLowerCase() ? "default" : "outline"}
            className="cursor-pointer"
          >
            {category}
          </Badge>
        </Link>
      ))}
    </div>
  );
};

export default CategoryFilter;