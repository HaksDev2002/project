import { Category, PaginatedResponse, Product } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// API response types
interface ApiResponse<T> {
  status: "success" | "error";
  data?: T;
  message?: string;
  errors?: string[];
}

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    if (data.status === "error") {
      throw new Error(data.message || "API request failed");
    }

    return data.data as T;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

export const api = {
  // Categories
  getCategories: () => apiRequest<Category[]>("/categories"),

  getCategoryById: (categoryId: string) =>
    apiRequest<Category>(`/categories/${categoryId}`),

  createCategory: (categoryData: { name: string; color: string }) =>
    apiRequest<Category>("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    }),

  updateCategory: (
    categoryId: string,
    categoryData: { name: string; color: string }
  ) =>
    apiRequest<Category>(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    }),

  deleteCategory: (categoryId: string) =>
    apiRequest<{ message: string }>(`/categories/${categoryId}`, {
      method: "DELETE",
    }),

  // Products
  getProducts: (params: {
    page?: number;
    limit?: number;
    search?: string;
    categories?: string[];
  }) => {
    const searchParams = new URLSearchParams();

    if (params.page) searchParams.append("page", params.page.toString());
    if (params.limit) searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.categories?.length) {
      searchParams.append("categories", params.categories.join(","));
    }

    return apiRequest<PaginatedResponse<Product>>(`/products?${searchParams}`);
  },

  createProduct: (productData: any) =>
    apiRequest<any>("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  deleteProduct: (productId: string) =>
    apiRequest<{ message: string }>(`/products/${productId}`, {
      method: "DELETE",
    }),

  editProduct: (productId: string, productData: any) =>
    apiRequest<any>(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  getProductById: (productId: string) =>
    apiRequest<any>(`/products/${productId}`),
};

// Types (re-export from existing types)
export type {
  Product,
  Category,
  CreateProductRequest,
  PaginatedResponse,
} from "../types";
