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
};

export type MultiFieldProps = {
  fieldName: 'emails' | 'phones';
  label: string;
  values: string[];
  onAdd: (fieldName: 'emails' | 'phones') => void;
  onRemove: (fieldName: 'emails' | 'phones', index: number) => void;
  form: any; // We'll keep this as any for now since it's from react-hook-form
  type: 'email' | 'tel';
};

export type SocialLinksFieldsProps = {
  form: any; // We'll keep this as any for now since it's from react-hook-form
};