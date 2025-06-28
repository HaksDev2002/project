export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  categories: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  quantity: number;
  categories: string[];
}

export interface ProductsState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategories: string[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  selectedProduct?: any;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}
