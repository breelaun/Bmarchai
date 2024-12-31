export interface BlogData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  image_url: string | null;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'scheduled';
  reading_time?: number;
  view_count?: number;
  scheduled_for?: string;
  language?: string;
  font_family?: string;
  is_private?: boolean;
}