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
  console.log('Rendering template preview:', template);
  
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
              {/* Header Section */}
              <div 
                className="h-16 rounded-lg"
                style={{ backgroundColor: template.style_config.colors.primary }}
              >
                <div className="flex items-center justify-between h-full px-6">
                  <div className="text-white font-bold">Store Name</div>
                  <div className="flex gap-4 text-white">
                    <span>Menu</span>
                    <span>Cart</span>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 grid grid-cols-12 gap-4">
                {/* Sidebar */}
                <div 
                  className="col-span-3 rounded-lg p-4"
                  style={{ backgroundColor: `${template.style_config.colors.secondary}20` }}
                >
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded" style={{ backgroundColor: template.style_config.colors.accent }}></div>
                    <div className="h-4 w-1/2 rounded" style={{ backgroundColor: template.style_config.colors.accent }}></div>
                    <div className="h-4 w-2/3 rounded" style={{ backgroundColor: template.style_config.colors.accent }}></div>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="col-span-9 grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg"
                      style={{ backgroundColor: `${template.style_config.colors.primary}15` }}
                    />
                  ))}
                </div>
              </div>
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