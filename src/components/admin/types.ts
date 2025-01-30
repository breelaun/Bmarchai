export interface ArtsEmbed {
  id: string;
  category_id: string;
  title: string;
  embed_url: string;
  created_at: string;
  end_date?: string;
  created_by?: string;
  arts_categories?: {
    name: string;
  };
}

export interface ArtsCategory {
  id: string;
  name: string;
}

export interface YouTubeEmbed {
  id: string;
  title: string;
  embed_type: 'channel' | 'playlist' | 'video';
  embed_id: string;
  created_at: string;
  created_by?: string;
  active: boolean;
  end_date?: string;
  category_id: string;
  arts_categories?: {
    name: string;
  };
}

export interface Advertisement {
  id: string;
  name: string;
  description: string;
  ad_type: string;
  content: string;
  media_url?: string;
  start_date: Date;
  end_date: Date;
  status: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}