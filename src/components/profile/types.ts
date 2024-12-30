export interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string | null;
  is_vendor: boolean;
  date_of_birth: string;
  country?: string;
  gender?: string | null;  // Changed from 'Male' | 'Female' | null to match database
  phone_number?: string;
}