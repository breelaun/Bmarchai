import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister } from "react-hook-form";
import { ProductFormData } from "../types";

interface CategoryInputProps {
  register: UseFormRegister<ProductFormData>;
}

const CategoryInput = ({ register }: CategoryInputProps) => {
  return (
    <div>
      <Label htmlFor="category">Category</Label>
      <Input
        id="category"
        {...register("category")}
        placeholder="Enter product category"
      />
    </div>
  );
};

export default CategoryInput;