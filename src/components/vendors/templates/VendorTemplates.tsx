import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import TemplatePreview from "./TemplatePreview";
import { TemplateGrid } from "./components/TemplateGrid";
import type { VendorTemplate } from "./types";

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
      <TemplateGrid
        templates={templates || []}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
        onPreview={setPreviewTemplate}
      />

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