export interface AdFormData {
  name: string;
  description: string;
  ad_type: string;
  content: string;
  media_url?: string;
  media_type?: string;
  embed_code?: string;
  file_urls?: string[];
  video_url?: string;
  start_date: Date;
  end_date: Date;
  status?: string;
}

export interface Advertisement extends AdFormData {
  id: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}