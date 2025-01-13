import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TemplateStyleConfig, TemplateLayoutConfig } from "../types/vendor-setup";

interface VendorTemplate {
  id: number;
  name: string;
  description: string | null;
  style_config: TemplateStyleConfig;
  layout_config: TemplateLayoutConfig;
}

interface TemplatePreviewProps {
  template: VendorTemplate;
  onClose: () => void;
}

const TemplatePreview = ({ template, onClose }: TemplatePreviewProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Preview: {template.name}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="mt-4">
          <div 
            className="aspect-video rounded-lg border bg-card p-4"
            style={{
              fontFamily: template.style_config.font,
              color: template.style_config.colors.text,
              backgroundColor: template.style_config.colors.background,
            }}
          >
            <div className="h-full flex flex-col gap-4">
              {template.layout_config.sections?.map((section: string, index: number) => (
                <div
                  key={section}
                  className="flex-1 rounded border border-dashed p-4 flex items-center justify-center"
                  style={{ 
                    borderColor: template.style_config.colors.secondary,
                    backgroundColor: index % 2 === 0 ? `${template.style_config.colors.primary}10` : 'transparent'
                  }}
                >
                  <span className="text-sm font-medium capitalize">{section}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>{template.description}</p>
            <p className="mt-2">
              Layout: <span className="font-medium capitalize">{template.layout_config.layout}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplatePreview;