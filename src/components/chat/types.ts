export interface Channel {
  id: string;
  name: string;
  description?: string;
  is_public: boolean;
  owner_id: string;
  channel_type: 'chat' | 'product_showcase' | 'video_stream';
  stream_config?: Record<string, any>;
  active_products?: Record<string, any>[];
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  is_edited: boolean;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
}

export interface ChatMember {
  channel_id: string;
  user_id: string;
  role: 'member' | 'admin';
  joined_at: string;
}

export interface Cell {
  text: string;
  rowIndex: number;
  colIndex: number;
  isSelected: boolean;
  isFound: boolean;
}

export interface ChannelProduct {
  id: string;
  channel_id: string;
  product_id: number;
  is_active: boolean;
  display_order?: number;
  is_featured: boolean;
  added_by: string;
  added_at: string;
  products?: {
    id: number;
    name: string;
    description: string;
    price: number;
    image_url: string;
  };
}

export interface Session {
  id: string;
  name: string;
  description?: string;
  session_type: 'live' | 'embed' | 'product';
  start_time: string;
  duration: string;
  max_participants: number;
  status: 'scheduled' | 'active' | 'ended' | 'completed';
  recording_settings?: {
    audio: boolean;
    video: boolean;
    quality: string;
    auto_start: boolean;
  };
  is_recording?: boolean;
  recording_url?: string;
  recording_start_time?: string;
  recording_end_time?: string;
  media_type?: string;
  media_url?: string;
  voice_over?: boolean;
  vendor_profiles?: {
    business_name: string;
    profiles: {
      username: string;
      avatar_url?: string;
    }[];
  }[];
}

export type SessionType = 'live' | 'embed' | 'product' | 'completed';

export interface SessionFormData {
  name: string;
  description: string;
  sessionType: 'free' | 'paid';
  price: number;
  isPrivate: boolean;
  sessionFormat: 'live' | 'embed' | 'product';
  duration: string;
  embedUrl: string;
  productUrl: string;
  cameraConfig: {
    front: boolean;
    rear: boolean;
    enabled: boolean;
  };
}
