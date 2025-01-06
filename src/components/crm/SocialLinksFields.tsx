import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { SocialLinksFieldsProps } from "./types";

export function SocialLinksFields({ form }: SocialLinksFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="socialLinks.linkedin"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="LinkedIn" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="socialLinks.twitter"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Twitter" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="socialLinks.facebook"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Facebook" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="socialLinks.instagram"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Instagram" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}