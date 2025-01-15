export interface VendorProfileData {
  id: string;
  business_name: string | null;
  business_description: string | null;
  contact_email: string | null;
  social_links: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  } | null;
  country: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
  template_id: number | null;
  customizations: Record<string, any>;
}