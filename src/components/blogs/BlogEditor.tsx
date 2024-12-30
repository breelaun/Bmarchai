import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  status: "draft" | "published" | "scheduled";
  scheduled_for?: Date;
  language: string;
  font_family: string;
  is_private: boolean;
  image_url?: string;
}

const BlogEditor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: "",
      status: "draft",
      language: "en",
      font_family: "sans",
      is_private: false,
    },
  });

  // Autosave functionality
  useEffect(() => {
    const autosaveInterval = setInterval(() => {
      if (form.formState.isDirty) {
        handleSave("draft");
      }
    }, 60000); // Autosave every minute

    return () => clearInterval(autosaveInterval);
  }, [form.formState.isDirty]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) {
      toast({
        title: "Error",
        description: "Image size must be less than 500KB",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from("blog-images")
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(fileName);

      setImagePreview(urlData.publicUrl);
      form.setValue("image_url", urlData.publicUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleSave = async (status: "draft" | "published" | "scheduled") => {
    try {
      setIsSubmitting(true);
      const values = form.getValues();
      const readingTime = calculateReadingTime(values.content);

      const { data, error } = await supabase.from("blogs").insert({
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        category: values.category,
        tags: values.tags.split(",").map((tag) => tag.trim()),
        status,
        scheduled_for: status === "scheduled" ? values.scheduled_for : null,
        reading_time: readingTime,
        language: values.language,
        font_family: values.font_family,
        is_private: values.is_private,
        image_url: values.image_url,
        author: "Anonymous", // TODO: Replace with actual user
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Blog post ${status === "published" ? "published" : "saved"}!`,
      });

      if (status === "published") {
        navigate("/blogs");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="font_family"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="sans">Sans-serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
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
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduled_for"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Schedule Publication</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border rounded-lg p-4">
            <FormLabel className="block mb-2">Featured Image</FormLabel>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 w-20 object-cover rounded"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave("draft")}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => handleSave("published")}
            disabled={isSubmitting}
          >
            Publish
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogEditor;