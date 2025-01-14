import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import type { ProductFormData, ProductCategory } from "../types";

interface CategoryInputProps {
  register: UseFormRegister<ProductFormData>;
  value?: ProductCategory;
  onChange?: (value: ProductCategory) => void;
}

const categories: ProductCategory[] = [
  'Books',
  'Clothing',
  'Consultation',
  'Ebook',
  'Photo',
  'Podcast',
  'Session'
];

const CategoryInput = ({ register, value, onChange }: CategoryInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select 
        value={value} 
        onValueChange={(val) => onChange?.(val as ProductCategory)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryInput;