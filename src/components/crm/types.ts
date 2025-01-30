export type ClientFormData = {
  name: string;
  company?: string;
  website?: string;
  emails: string[];
  phones: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  notes?: string;
  contactType: 'client' | 'contact' | 'lead';
  lead_source_id?: string;
  lead_stage?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  lead_temperature?: 'cold' | 'warm' | 'hot';
  expected_value?: number;
  probability?: number;
  next_follow_up?: string;
};

export type MultiFieldProps = {
  fieldName: 'emails' | 'phones';
  label: string;
  values: string[];
  onAdd: (fieldName: 'emails' | 'phones') => void;
  onRemove: (fieldName: 'emails' | 'phones', index: number) => void;
  form: any;
  type: 'email' | 'tel';
};

export type SocialLinksFieldsProps = {
  form: any;
};