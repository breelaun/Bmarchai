export type SetupStep = "template" | "display" | "bento" | "additional" | "confirmation";

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface VendorCustomizations {
  display_style: string;
  bento_style: string;
}

// Update VendorProfileInsert to include country and timezone
export interface VendorProfileInsert {
  id: string;
  template_id: number | null;
  customizations: {
    display_style: string;
    bento_style: string;
  };
  business_description: string | null;
  social_links: Record<string, string>;
  country: string | null;
  timezone: string | null;
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