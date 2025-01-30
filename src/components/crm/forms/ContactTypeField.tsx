import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { ClientFormData } from "../types";

interface ContactTypeFieldProps {
  form: UseFormReturn<ClientFormData>;
}

export const ContactTypeField = ({ form }: ContactTypeFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="contactType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contact Type *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select contact type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="contact">Contact</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};