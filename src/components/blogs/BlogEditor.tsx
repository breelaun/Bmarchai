import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import BlogEditorForm from "./BlogEditorForm";
import { BlogFormData } from "@/types/blog";
import { useForm } from "react-hook-form";

const BlogEditor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  
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

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleSave = async (status: "draft" | "published" | "scheduled") => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to save a blog post",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const values = form.getValues();
      const readingTime = calculateReadingTime(values.content);

      const blogData = {
        title: values.title,
        content: values.content,
        excerpt: values.excerpt,
        category: values.category,
        tags: values.tags.split(",").map((tag) => tag.trim()),
        status,
        scheduled_for: values.scheduled_for,
        reading_time: readingTime,
        language: values.language,
        font_family: values.font_family,
        is_private: values.is_private,
        image_url: values.image_url,
        author: session.user.email || "Anonymous",
      };

      const { error } = await supabase.from("blogs").insert(blogData);

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

  return <BlogEditorForm form={form} onSave={handleSave} isSubmitting={isSubmitting} />;
};

export default BlogEditor;