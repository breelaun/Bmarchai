export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  inventory_count: number;
  is_featured: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  parent_id: string | null;
}

export type ProductStatus = 'active' | 'draft' | 'archived';

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  featured?: boolean;
}