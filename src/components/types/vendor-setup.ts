export interface VendorProfileData {
  id: string;
  business_name: string | null;
  business_description: string | null;
  contact_email: string | null;
  social_links: {
    facebook: string;
    instagram: string;
    twitter: string;
  } | null;
  created_at: string;
  updated_at: string;
  timezone?: string;
  country?: string;
}

export interface VendorData {
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  aboutMe: string;
  enableReviews: boolean;
  enableFeatured: boolean;
}

export interface VendorSetupData {
  template_id?: number;
  customizations?: {
    display_style?: string;
    bento_style?: string;
  };
  business_name?: string;
  business_description?: string;
  contact_email?: string;
  social_links?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  timezone?: string;
  country?: string;
}