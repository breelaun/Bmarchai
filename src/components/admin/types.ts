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