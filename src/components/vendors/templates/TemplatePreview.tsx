import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Define minimal required types inline
interface TemplateStyleConfig {
  font: string;
  colors: {
    text: string;
    background: string;
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface TemplateLayoutConfig {
  layout: 'classic' | 'modern' | 'masonry' | 'carousel' | 'fullscreen' | 'split';
}

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
  const [previewError, setPreviewError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for template preparation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [template.id]);

  if (previewError) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <div className="p-4 text-center text-red-500">
            Failed to load template preview. Please try again.
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (loading) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent>
          <div className="p-4 text-center">Loading preview...</div>
        </DialogContent>
      </Dialog>
    );
  }

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
            className="aspect-video rounded-lg border bg-card p-4 overflow-hidden"
            style={{
              fontFamily: template.style_config.font,
              color: template.style_config.colors.text,
              backgroundColor: template.style_config.colors.background,
            }}
          >
            <div className="h-full flex flex-col gap-4">
              {template.layout_config.layout === 'classic' && (
                <ClassicLayout colors={template.style_config.colors} />
              )}
              {template.layout_config.layout === 'modern' && (
                <ModernLayout colors={template.style_config.colors} />
              )}
              {template.layout_config.layout === 'masonry' && (
                <MasonryLayout colors={template.style_config.colors} />
              )}
              {template.layout_config.layout === 'carousel' && (
                <CarouselLayout colors={template.style_config.colors} />
              )}
              {template.layout_config.layout === 'fullscreen' && (
                <FullscreenLayout colors={template.style_config.colors} />
              )}
              {template.layout_config.layout === 'split' && (
                <SplitLayout colors={template.style_config.colors} />
              )}
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

const ClassicLayout = ({ colors }) => (
  <>
    <div 
      className="h-16 rounded-lg"
      style={{ backgroundColor: colors.primary }}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="text-white font-bold">Store Name</div>
        <div className="flex gap-4 text-white">
          <span>Menu</span>
          <span>Cart</span>
        </div>
      </div>
    </div>
    <div className="flex-1 grid grid-cols-12 gap-4">
      <div 
        className="col-span-3 rounded-lg p-4"
        style={{ backgroundColor: `${colors.secondary}20` }}
      >
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded" style={{ backgroundColor: colors.accent }}></div>
          <div className="h-4 w-1/2 rounded" style={{ backgroundColor: colors.accent }}></div>
          <div className="h-4 w-2/3 rounded" style={{ backgroundColor: colors.accent }}></div>
        </div>
      </div>
      <div className="col-span-9 grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-lg"
            style={{ backgroundColor: `${colors.primary}15` }}
          />
        ))}
      </div>
    </div>
  </>
);

const ModernLayout = ({ colors }) => (
  <div className="grid grid-cols-2 gap-4 h-full">
    {[1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="rounded-lg p-4"
        style={{ backgroundColor: `${colors.secondary}15` }}
      >
        <div className="h-4 w-3/4 rounded mb-2" style={{ backgroundColor: colors.accent }}></div>
        <div className="h-4 w-1/2 rounded" style={{ backgroundColor: `${colors.primary}30` }}></div>
      </div>
    ))}
  </div>
);

const MasonryLayout = ({ colors }) => (
  <div className="grid grid-cols-3 gap-4 h-full">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="space-y-4"
      >
        {[1, 2].map((j) => (
          <div
            key={j}
            className="rounded-lg"
            style={{ 
              backgroundColor: `${colors.secondary}15`,
              height: `${Math.floor(Math.random() * 100 + 100)}px`
            }}
          />
        ))}
      </div>
    ))}
  </div>
);

const CarouselLayout = ({ colors }) => (
  <div className="flex gap-4 overflow-x-auto py-2 h-full items-center">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="flex-none w-64 h-64 rounded-lg"
        style={{ backgroundColor: `${colors.secondary}15` }}
      />
    ))}
  </div>
);

const FullscreenLayout = ({ colors }) => (
  <div 
    className="h-full rounded-lg flex items-center justify-center"
    style={{ backgroundColor: `${colors.primary}15` }}
  >
    <div 
      className="p-8 rounded-lg"
      style={{ backgroundColor: colors.secondary }}
    >
      <div className="h-4 w-32 rounded mb-2" style={{ backgroundColor: colors.accent }}></div>
      <div className="h-4 w-24 rounded" style={{ backgroundColor: `${colors.primary}30` }}></div>
    </div>
  </div>
);

const SplitLayout = ({ colors }) => (
  <div className="grid grid-cols-2 h-full gap-4">
    <div 
      className="rounded-lg p-6"
      style={{ backgroundColor: `${colors.primary}15` }}
    >
      <div className="space-y-2">
        <div className="h-4 w-3/4 rounded" style={{ backgroundColor: colors.accent }}></div>
        <div className="h-4 w-1/2 rounded" style={{ backgroundColor: `${colors.primary}30` }}></div>
      </div>
    </div>
    <div 
      className="rounded-lg p-6"
      style={{ backgroundColor: `${colors.secondary}15` }}
    >
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-lg"
            style={{ backgroundColor: `${colors.primary}15` }}
          />
        ))}
      </div>
    </div>
  </div>
);

export default TemplatePreview;
