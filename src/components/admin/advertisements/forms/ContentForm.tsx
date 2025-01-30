import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { AdFormData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

interface ContentFormProps {
  form: UseFormReturn<AdFormData>;
}

export const ContentForm = ({ form }: ContentFormProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('ad-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('ad-media')
        .getPublicUrl(filePath);

      // Update the form with the new file URL
      const currentUrls = form.getValues('file_urls') || [];
      form.setValue('file_urls', [...currentUrls, publicUrl]);

      toast({
        title: "File uploaded successfully",
        description: "Your file has been uploaded and added to the ad.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="ad_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ad Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select ad type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="banner">Banner</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="embed">Embed</SelectItem>
                <SelectItem value="popup">Popup</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('ad_type') === 'embed' ? (
        <FormField
          control={form.control}
          name="embed_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embed Code</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Paste embed code here" className="font-mono" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : form.watch('ad_type') === 'video' ? (
        <FormField
          control={form.control}
          name="video_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter video URL" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
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
                <FormLabel>Media URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Media URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <div className="space-y-2">
        <FormLabel>Upload Files</FormLabel>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload File
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,video/*"
          />
        </div>
        {form.watch('file_urls')?.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Uploaded files:</p>
            <ul className="list-disc pl-5">
              {form.watch('file_urls').map((url, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {url.split('/').pop()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};