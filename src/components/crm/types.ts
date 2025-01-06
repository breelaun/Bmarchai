export interface Client {
  id: string;
  name: string;
  company?: string;
  emails?: string[];
  phone?: string;
  social_links?: Record<string, string | null>;
  website?: string;
  contact_type?: string;
  status?: string;
}