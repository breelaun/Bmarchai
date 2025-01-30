import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { AdFormData } from "../types";

interface ContentFormProps {
  form: UseFormReturn<AdFormData>;
}

export const ContentForm = ({ form }: ContentFormProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Advertisement content" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="media_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Media URL (optional)</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Media URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};