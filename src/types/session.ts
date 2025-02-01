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
  price: number;
  session_type: 'free' | 'paid';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  session_participants?: {
    user_id: string;
    has_completed: boolean;
    rating?: number;
    tip_amount?: number;
    payment_method?: 'card' | 'cash';
    payment_status?: string;
    payment_confirmed_at?: string;
    payment_confirmed_by?: string;
    payment_notes?: string;
    profiles?: {
      username: string;
      avatar_url?: string;
    };
  }[];
}