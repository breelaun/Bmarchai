import { useState } from "react";
import { useAuth } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogImageUploadProps {
  onImageUpload: (url: string) => void;
}

const BlogImageUpload = ({ onImageUpload }: BlogImageUploadProps) => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const auth = useAuth();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!auth?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to upload images",
        variant: "destructive",
      });
      return;
    }

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
      onImageUpload(urlData.publicUrl);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-lg p-4">
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
  );
};

export default BlogImageUpload;