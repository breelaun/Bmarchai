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
}