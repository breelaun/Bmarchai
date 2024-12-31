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
    <div className="mb-6">
      <h2 className="text-2xl font-bold mb-4">My Blogs</h2>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedCategory === null ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onCategorySelect(null)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="cursor-pointer"
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