export interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  status: "draft" | "published" | "scheduled";
  scheduled_for?: string;
  language: string;
  font_family: string;
  is_private: boolean;
  image_url?: string;
  slug?: string; // Optional since it's auto-generated
}

export interface BlogData extends Omit<BlogFormData, 'tags'> {
  id: number;
  author: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  reading_time?: number;
  view_count?: number;
}