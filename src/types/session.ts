
export interface SessionWithVendor {
  id: string;
  name: string;
  description: string | null;
  start_time: string;
  duration: string;
  max_participants: number;
  completed_at: string | null;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  recording_id: string | null;
  vendor_profiles: Array<{
    business_name: string;
    profiles: Array<{
      username: string;
    }>;
  }>;
}

// Alias for backward compatibility with existing components
export type Session = SessionWithVendor;
