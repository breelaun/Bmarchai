import { Badge } from "@/components/ui/badge";

interface ProfileBlogFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const ProfileBlogFilter = ({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}: ProfileBlogFilterProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-bold tracking-tight">Categories</h2>
      <div className="flex flex-wrap gap-4">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer text-lg py-2 px-4"
          onClick={() => onCategorySelect(null)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer text-lg py-2 px-4"
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ProfileBlogFilter;