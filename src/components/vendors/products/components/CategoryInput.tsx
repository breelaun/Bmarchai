import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryInputProps {
  category: string;
  onCategoryChange: (value: string) => void;
}

const CategoryInput = ({ category, onCategoryChange }: CategoryInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCategoryChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Input
        id="category"
        value={category}
        onChange={handleChange}
        placeholder="Enter product category"
      />
    </div>
  );
};

export default CategoryInput;