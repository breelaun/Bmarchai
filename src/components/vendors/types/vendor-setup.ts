export type SetupStep = "template" | "display" | "bento" | "additional" | "confirmation";

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  [key: string]: string; // Add index signature
}

export interface VendorCustomizations {
  display_style: string;
  bento_style: string;
}

export interface TemplateStyleConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  font: string;
}

export interface TemplateLayoutConfig {
  layout: string;
  sections: string[];
}

export interface VendorProfileData {
  id: string;
  template_id: number | null;
  customizations: VendorCustomizations | null;
  business_name: string | null;
  business_description: string | null;
  contact_email: string | null;
  social_links: SocialLinks | null;
  created_at: string;
  updated_at: string;
  template?: {
    id: number;
    name: string;
    description: string | null;
    style_config: TemplateStyleConfig;
    layout_config: TemplateLayoutConfig;
  };
}