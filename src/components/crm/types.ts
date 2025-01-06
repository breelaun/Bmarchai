import { UseFormReturn } from "react-hook-form";
import { Json } from "@/integrations/supabase/types";

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
  notes?: string;
  created_at?: string;
  updated_at?: string;
  vendor_id?: string;
}

export interface ClientFormData {
  name: string;
  company: string;
  website: string;
  emails: string[];
  phones: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };
  notes: string;
  contactType: 'client' | 'contact' | 'lead';
}

export interface MultiFieldProps {
  fieldName: 'emails' | 'phones';
  label: string;
  values: string[];
  onAdd: (fieldName: 'emails' | 'phones') => void;
  onRemove: (fieldName: 'emails' | 'phones', index: number) => void;
  form: UseFormReturn<ClientFormData>;
  type: 'email' | 'tel';
}

export interface SocialLinksFieldsProps {
  form: UseFormReturn<ClientFormData>;
}

export interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}