import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type VendorTemplate = Database['public']['Tables']['vendor_templates']['Row'] & {
  style_config: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      accent: string;
    };
    font: string;
  };
};

interface TemplatePreviewProps {
  template: VendorTemplate;
  onClose: () => void;
}

const TemplatePreview = ({ template, onClose }: TemplatePreviewProps) => {
  const styleConfig = template.style_config as VendorTemplate['style_config'];

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
              fontFamily: styleConfig.font,
              color: styleConfig.colors.text,
              backgroundColor: styleConfig.colors.background,
            }}
          >
            <div className="h-full flex flex-col gap-4">
              {template.layout_config.sections?.map((section: string, index: number) => (
                <div
                  key={section}
                  className="flex-1 rounded border border-dashed p-4 flex items-center justify-center"
                  style={{ 
                    borderColor: styleConfig.colors.secondary,
                    backgroundColor: index % 2 === 0 ? `${styleConfig.colors.primary}10` : 'transparent'
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