import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import type { VendorTemplate } from "../types";

interface TemplateCardProps {
  template: VendorTemplate;
  isSelected: boolean;
  onPreview: () => void;
}

export const TemplateCard = ({ template, isSelected, onPreview }: TemplateCardProps) => {
  return (
    <Card 
      key={template.id}
      className={`relative w-full transition-all ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <RadioGroupItem value={template.id.toString()} id={`template-${template.id}`} />
          <div className="flex-1">
            <Label htmlFor={`template-${template.id}`} className="font-medium">
              {template.name}
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </Label>
            <div className="mt-2 flex items-center gap-2">
              {Object.entries(template.style_config.colors).map(([key, color]) => (
                <div 
                  key={key}
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                  title={key}
                />
              ))}
              <span className="text-xs text-muted-foreground ml-2">
                {template.style_config.font}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onPreview}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};