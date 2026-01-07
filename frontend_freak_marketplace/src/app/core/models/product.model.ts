export interface Category {
  id: string;
  name: { [key: string]: string };
  slug: string;
  schema: string[];
  icon: string;
}

export interface Product {
  id: string;
  seller: number;
  category: Category;
  title: string;
  description: string;
  price: number;
  specifications: { [key: string]: string };
  images: string[];
  is_boosted: boolean;
  boost_type: 'NONE' | 'NEON' | 'GOLD';
  boost_expires_at?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  created_at: string;
  updated_at: string;
  is_boost_active?: boolean;
}

export interface ProductFilters {
  category?: string;
  status?: string;
  boost_type?: string;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface ProductCreateRequest {
  category: string;
  title: string;
  description: string;
  price: number;
  specifications: { [key: string]: string };
  images: string[];
}

export type ProductUpdateRequest = Partial<ProductCreateRequest>;

export interface PaginatedProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
