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

export interface BannerData {
  type: 'image' | 'video';
  url: string;
  position?: {
    x: number;
    y: number;
  };
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
    unit: 'px' | '%';
  };
}

export interface VendorProfile extends VendorProfileData {
  banner_data?: BannerData;
}