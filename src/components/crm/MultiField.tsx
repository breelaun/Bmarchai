import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@radix-ui/react-label";
import { Plus, X } from "lucide-react";
import type { MultiFieldProps } from "./types";

export function MultiField({
  fieldName,
  label,
  values,
  onAdd,
  onRemove,
  form,
  type
}: MultiFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <FormLabel>{label}</FormLabel>
        {values?.length < 3 && (
          <Button type="button" variant="outline" size="sm" onClick={() => onAdd(fieldName)}>
            <Plus className="h-4 w-4 mr-1" /> Add {fieldName === 'emails' ? 'Email' : 'Phone'}
          </Button>
        )}
      </div>
      {values?.map((_, index) => (
        <div key={index} className="flex gap-2">
          <FormField
            control={form.control}
            name={`${fieldName}.${index}`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input type={type} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {index > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(fieldName, index)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}