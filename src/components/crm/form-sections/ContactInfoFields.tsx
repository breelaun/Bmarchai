import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import type { ClientFormData } from "../types";

interface ContactInfoFieldsProps {
  form: UseFormReturn<ClientFormData>;
}

export function ContactInfoFields({ form }: ContactInfoFieldsProps) {
  return (
    <div className="space-y-4">
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

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                {...field} 
                onChange={(e) => {
                  let value = e.target.value;
                  // If the input doesn't start with http:// or https://, add https://
                  if (value && !value.match(/^https?:\/\//)) {
                    value = `https://${value}`;
                  }
                  field.onChange(value);
                }}
                placeholder="website.com"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}