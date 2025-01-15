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
  template_id?: number;
  customizations?: Record<string, unknown>;
}