export interface Session {
  id: string;
  name: string;
  description: string;
  start_time: string;
  duration: string;
  max_participants: number;
  vendor_profiles: {
    business_name: string;
    profiles: {
      username: string;
    }[];
  }[];
}