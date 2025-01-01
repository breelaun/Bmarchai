import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import TemplatePreview from "./TemplatePreview";
import { Database } from "@/integrations/supabase/types";

type VendorTemplate = Database['public']['Tables']['vendor_templates']['Row'] & {
  style_config: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
    };
    font: string;
  };
  layout_config: {
    layout: string;
    sections: string[];
  };
};

interface TemplateSelectionProps {
  selectedTemplate: number | null;
  setSelectedTemplate: (id: number) => void;
}

const TemplateSelection = ({ selectedTemplate, setSelectedTemplate }: TemplateSelectionProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<VendorTemplate | null>(null);

  const { data: templates, isLoading } = useQuery({
    queryKey: ["vendorTemplates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_templates")
        .select("*")
        .order("id");
      
      if (error) throw error;
      return data as VendorTemplate[];
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-heading font-semibold">Choose Your Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-semibold">Choose Your Template</h2>
      <RadioGroup value={selectedTemplate?.toString()} onValueChange={(value) => setSelectedTemplate(parseInt(value))}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates?.map((template) => (
            <Card 
              key={template.id}
              className={`relative transition-all ${
                selectedTemplate === template.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={template.id.toString()} id={`template-${template.id}`} />
                  <div className="flex-1">
                    <Label htmlFor={`template-${template.id}`} className="font-medium">
                      {template.name}
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </Label>
                    <div className="mt-2 flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: template.style_config.colors.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: template.style_config.colors.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: template.style_config.colors.background }}
                      />
                      <span className="text-xs text-muted-foreground ml-2">
                        {template.style_config.font}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {previewTemplate && (
        <TemplatePreview
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
};

export default TemplateSelection;