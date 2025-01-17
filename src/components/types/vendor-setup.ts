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
  banner_data?: BannerData | null;
  customizations?: Record<string, unknown>;
  template_id?: number;
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
  profiles?: {
    username: string | null;
    avatar_url: string | null;
  };
  products?: Array<{
    id: number;
    name: string;
    price: number;
    image_url: string | null;
  }>;
}

export interface VendorDisplayData {
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  aboutMe: string;
  enableReviews: boolean;
  enableFeatured: boolean;
}