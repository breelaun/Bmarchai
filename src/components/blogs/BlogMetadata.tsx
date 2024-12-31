import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/types/blog";
import { languages } from "./data/languages";
import { fonts } from "./data/fonts";
import { categories } from "./data/categories";

interface BlogMetadataProps {
  form: UseFormReturn<BlogFormData>;
}

const BlogMetadata = ({ form }: BlogMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags (comma-separated)</FormLabel>
            <FormControl>
              <Input placeholder="tag1, tag2, tag3" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="font_family"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Font</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fonts.map((font) => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    className={`${font.className} text-foreground`}
                  >
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="is_private"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Private Post</FormLabel>
              <div className="text-sm text-muted-foreground">
                Make this post private and visible only to you
              </div>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default BlogMetadata;