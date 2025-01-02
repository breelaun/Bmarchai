import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProductFormData } from "../types";

interface PricingInventoryProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

const PricingInventory = ({ register, errors }: PricingInventoryProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price must be positive" }
          })}
        />
        {errors.price && (
          <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="inventory_count">Inventory Count</Label>
        <Input
          id="inventory_count"
          type="number"
          {...register("inventory_count", {
            required: "Inventory count is required",
            min: { value: 0, message: "Inventory must be positive" }
          })}
        />
        {errors.inventory_count && (
          <p className="text-sm text-destructive mt-1">{errors.inventory_count.message}</p>
        )}
      </div>
    </div>
  );
};

export default PricingInventory;