export type SetupStep = "template" | "display" | "bento" | "additional" | "confirmation";

export interface TemplateStyleConfig {
  colors: {
    primary: string;
    secondary: string;
  };
  font: string;
}

export interface SocialLinks extends Record<string, string> {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface VendorTheme {
  primaryColor: string;
  secondaryColor: string;
  font: string;
}

export interface VendorCustomizations {
  theme?: VendorTheme;
  display_style?: string;
  bento_style?: string;
}

export interface VendorSetupState {
  selectedTemplate: number | null;
  selectedDisplay: string;
  selectedBento: string;
  socialLinks: SocialLinks;
  aboutMe: string;
  enableReviews: boolean;
  enableFeatured: boolean;
}

export interface VendorProfileInsert {
  id: string;
  template_id: number | null;
  customizations: VendorCustomizations;
  business_description: string | null;
  social_links: Record<string, string>;
}