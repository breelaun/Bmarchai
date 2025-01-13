import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import type { ProductFormData } from "../types";

interface CategoryInputProps {
  register: UseFormRegister<ProductFormData>;
}

const CategoryInput = ({ register }: CategoryInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <Input
        id="category"
        placeholder="Enter product category"
        {...register("category")}
      />
    </div>
  );
};

export default CategoryInput;