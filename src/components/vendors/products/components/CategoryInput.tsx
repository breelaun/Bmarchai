import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategoryInputProps {
  onChange: (value: string) => void;
  value: string;
}

const CategoryInput = ({ onChange, value }: CategoryInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Input
        id="category"
        placeholder="Enter product category"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export default CategoryInput;