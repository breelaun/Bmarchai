import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TemplateStyleConfig } from "../types/vendor-setup";

// Type guard to validate the style config structure
function isTemplateStyleConfig(obj: unknown): obj is TemplateStyleConfig {
  if (typeof obj !== 'object' || obj === null) return false;
  
  const candidate = obj as any;
  return (
    candidate.colors &&
    typeof candidate.colors.primary === 'string' &&
    typeof candidate.colors.secondary === 'string' &&
    typeof candidate.font === 'string'
  );
}

export function useTemplateData(selectedTemplate: number | null) {
  return useQuery({
    queryKey: ["vendorTemplate", selectedTemplate],
    queryFn: async () => {
      if (!selectedTemplate) return null;
      const { data, error } = await supabase
        .from("vendor_templates")
        .select("*")
        .eq("id", selectedTemplate)
        .single();
      
      if (error) throw error;
      
      if (!isTemplateStyleConfig(data.style_config)) {
        throw new Error("Invalid template style configuration");
      }
      
      return {
        ...data,
        style_config: data.style_config as TemplateStyleConfig,
      };
    },
    enabled: !!selectedTemplate,
  });
}