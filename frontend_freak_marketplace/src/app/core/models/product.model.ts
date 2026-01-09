export interface Product {
  id: string;
  seller: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  category: Category;
  title: string;
  description: string;
  price: number;
  specifications: Record<string, any>;
  images: string[];
  is_boosted: boolean;
  boost_type: 'NONE' | 'NEON' | 'GOLD';
  boost_expires_at?: string;
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: Record<string, string>; // multilenguaje: {"es": "Cartas Pokémon", "en": "Pokémon Cards"}
  slug: string;
  schema: string[]; // ["Estado", "Rareza", "Idioma", "Edición"]
  icon: string;
}

export interface ProductFilter {
  category?: string;
  status?: string;
  boost_type?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  ordering?: '-created_at' | '-price' | 'price' | 'is_boosted' | '-updated_at';
}

export interface ProductCreateRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  specifications: Record<string, any>;
  images: string[];
  boost_type: 'NONE' | 'NEON' | 'GOLD';
}

export interface ProductUpdateRequest {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  specifications?: Record<string, any>;
  images?: string[];
  status?: 'AVAILABLE' | 'RESERVED' | 'SOLD';
}

export interface BoostPurchaseRequest {
  product_id: string;
  boost_type: 'NEON' | 'GOLD';
  duration_days: number;
}

export interface PaginatedProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
