export interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string | null;
  is_vendor: boolean;
  date_of_birth: string;
  country?: string;
  gender?: string | null;
  phone_number?: string;
  default_banner_url?: string;
}