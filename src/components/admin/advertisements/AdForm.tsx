import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { BasicInfoForm } from "./forms/BasicInfoForm";
import { ContentForm } from "./forms/ContentForm";
import { DateForm } from "./forms/DateForm";
import type { AdFormData } from "./types";

interface AdFormProps {
  onSuccess?: () => void;
  initialData?: AdFormData & { id: string };
}

export const AdForm = ({ onSuccess, initialData }: AdFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AdFormData>({
    defaultValues: initialData || {
      name: "",
      description: "",
      ad_type: "banner",
      content: "",
      media_url: "",
      media_type: "image",
      embed_code: "",
      file_urls: [],
      video_url: "",
      start_date: new Date(),
      end_date: new Date(),
      status: "draft",
    },
  });

  const onSubmit = async (data: AdFormData) => {
    setIsSubmitting(true);
    try {
      if (initialData?.id) {
        const { error } = await supabase
          .from("advertisements")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Advertisement updated successfully",
        });
      } else {
        const { error } = await supabase.from("advertisements").insert({
          ...data,
          status: "draft",
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Advertisement created successfully",
        });
      }

      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      form.reset();
      onSuccess?.();
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicInfoForm form={form} />
        <ContentForm form={form} />
        <DateForm form={form} />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? initialData
              ? "Updating..."
              : "Creating..."
            : initialData
            ? "Update Advertisement"
            : "Create Advertisement"}
        </Button>
      </form>
    </Form>
  );
};