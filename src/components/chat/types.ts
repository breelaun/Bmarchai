export interface Channel {
  id: string;
  name: string;
  is_public: boolean;
  channel_type?: 'chat' | 'product_showcase' | 'video_stream';
  stream_config?: Record<string, any>;
  active_products?: Record<string, any>[];
}

export interface Section {
  id: string;
  name: string;
  channel_id: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender?: {
    username: string;
    avatar_url: string;
  };
}