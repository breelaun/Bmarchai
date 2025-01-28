export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  inventory_count: number;
  is_featured: boolean;
  embedUrl?: string;
}

export type ProductCategory = 'Books' | 'Clothing' | 'Consultation' | 'Ebook' | 'Photo' | 'Podcast' | 'Session';

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  featured?: boolean;
}

export interface ProductFile {
  file: File;
  type: string;
}
