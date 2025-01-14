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

export interface Session {
  id: string;
  vendor_id: string;
  name: string;
  description: string | null;
  price: number;
  duration: string;
  start_time: string;
  max_participants: number | null;
  created_at: string;
  updated_at: string;
}

export interface SessionMedia {
  id: string;
  session_id: string;
  media_type: string;
  media_url: string;
  display_order: number;
  created_at: string;
}

export interface SessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  has_completed: boolean | null;
  rating: number | null;
  tip_amount: number | null;
  created_at: string;
  updated_at: string;
}