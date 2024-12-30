import { BlogFormData } from "@/types/blog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import BlogMetadata from "./BlogMetadata";
import BlogScheduler from "./BlogScheduler";
import BlogImageUpload from "./BlogImageUpload";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";

interface BlogEditorFormProps {
  form: UseFormReturn<BlogFormData>;
  onSave: (status: "draft" | "published" | "scheduled") => void;
  isSubmitting: boolean;
}

const BlogEditorForm = ({ form, onSave, isSubmitting }: BlogEditorFormProps) => {
  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a brief description"
                  className="h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your blog content here..."
                  className="min-h-[400px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <BlogMetadata form={form} />
        <BlogScheduler form={form} />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <BlogImageUpload onImageUpload={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSave("draft")}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => onSave("published")}
            disabled={isSubmitting}
          >
            Publish
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogEditorForm;