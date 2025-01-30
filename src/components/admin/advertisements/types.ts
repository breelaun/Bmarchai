export interface AdFormData {
  name: string;
  description: string;
  ad_type: string;
  content: string;
  media_url?: string;
  start_date: Date;
  end_date: Date;
  status?: string;
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