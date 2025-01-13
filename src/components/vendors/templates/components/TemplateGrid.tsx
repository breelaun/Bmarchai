import React from 'react';
import { RadioGroup } from "@/components/ui/radio-group";
import { TemplateCard } from "./TemplateCard";
import type { VendorTemplate } from "../types";

interface TemplateGridProps {
  templates: VendorTemplate[];
  selectedTemplate: number | null;
  onTemplateSelect: (id: number) => void;
  onPreview: (template: VendorTemplate) => void;
}

export const TemplateGrid = ({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect,
  onPreview 
}: TemplateGridProps) => {
  return (
    <RadioGroup 
      value={selectedTemplate?.toString()} 
      onValueChange={(value) => onTemplateSelect(parseInt(value))}
    >
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
        {templates?.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate === template.id}
            onPreview={() => onPreview(template)}
          />
        ))}
      </div>
    </RadioGroup>
  );
};