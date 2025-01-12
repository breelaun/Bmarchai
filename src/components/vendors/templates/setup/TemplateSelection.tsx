// src/components/vendors/setup/TemplateSelection.tsx
import { useState } from 'react';
import { allTemplates } from '../templates';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TemplateSelectionProps {
  selectedTemplate: number;
  setSelectedTemplate: (templateId: number) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  selectedTemplate,
  setSelectedTemplate,
}) => {
  const [previewColors, setPreviewColors] = useState({
    primary: '#4F46E5',
    secondary: '#818CF8',
    background: '#FFFFFF',
    text: '#1F2937',
    accent: '#C7D2FE',
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Choose Your Template</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {allTemplates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <div className="p-4">
              <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                {/* Preview */}
                <template.component
                  colors={previewColors}
                  storeName="Preview Store"
                  menuItems={[]}
                  products={[]}
                  aboutText=""
                  socialLinks={[]}
                />
              </div>
