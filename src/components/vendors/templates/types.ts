// Vendor Template Types
export interface TemplateColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export interface TemplateStyleConfig {
  colors: TemplateColors;
  font: string;
}

export interface TemplateLayoutConfig {
  layout: string;
  sections: string[];
}

export interface VendorTemplate {
  id: number;
  name: string;
  description: string | null;
  style_config: TemplateStyleConfig;
  layout_config: TemplateLayoutConfig;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorTemplateProps {
  bannerImage?: string;
  profileImage?: string;
  storeName: string;
  menuItems: string[];
  products: any[];
  aboutText: string;
  socialLinks: {
    platform: string;
    url: string;
  }[];
  colors: TemplateColors;
}

export interface TemplateOption {
  id: number;
  name: string;
  component: React.FC<VendorTemplateProps>;
  preview: string;
  description: string;
}

export interface TemplatePreviewProps {
  template: VendorTemplate;
  onClose: () => void;
}

export interface TemplateSelectionProps {
  selectedTemplate: number | null;
  setSelectedTemplate: (id: number) => void;
}