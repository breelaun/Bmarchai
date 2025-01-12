import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { ProductFormData } from "../types";

interface CategoryInputProps {
  register: UseFormRegister<ProductFormData>;
}

const PRODUCT_CATEGORIES = [
  "Videos",
  "Clothing",
  "PDF",
  "Book",
  "Podcast",
  "Ebook",
  "Lives",
  "Photo",
  "Session"
] as const;

const CategoryInput = ({ register }: CategoryInputProps) => {
  const { onChange, ...rest } = register("category");

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Select 
        onValueChange={onChange} 
        {...rest}
      >
        <SelectTrigger id="category" className="bg-background border-input">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-black text-white">
          {PRODUCT_CATEGORIES.map((category) => (
            <SelectItem 
              key={category} 
              value={category}
              className="hover:bg-gray-800"
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryInput;