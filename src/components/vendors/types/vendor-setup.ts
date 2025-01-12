export type SetupStep = "template" | "display" | "bento" | "additional" | "confirmation";

export interface TemplateStyleConfig {
  colors: {
    primary: string;
    secondary: string;
    background: string;  // Made required to fix type error
  };
  font: string;
}

export interface SocialLinks extends Record<string, string> {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface VendorCustomizations {
  display_style: string;
  bento_style: string;
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
  timezone: string;
  country: string;
  template?: {
    id: number;
    name: string;
    description: string | null;
    style_config: Record<string, unknown>;
    layout_config: Record<string, unknown>;
  };
}

export interface VendorProfileInsert {
  id: string;
  template_id: number | null;
  customizations: {
    display_style: string;
    bento_style: string;
  };
  business_description: string | null;
  social_links: Record<string, string>;
  country: string;
  timezone: string;
}

export interface VendorSetupState {
  selectedTemplate: number | null;
  selectedDisplay: string;
  selectedBento: string;
  socialLinks: SocialLinks;
  aboutMe: string;
  enableReviews: boolean;
  enableFeatured: boolean;
  country: string;
  timezone: string;
}