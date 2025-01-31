export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  default_banner_url: string | null;
  is_vendor: boolean | null;
  created_at: string;
  updated_at: string;
  date_of_birth: string;
  country: string | null;
  gender: string | null;
  phone_number: string | null;
  email_notifications: boolean | null;
  sms_notifications: boolean | null;
  two_factor_enabled: boolean | null;
  default_banner_url?: string;
}
