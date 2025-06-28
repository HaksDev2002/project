import { Product, Category, CreateProductRequest, PaginatedResponse } from '../types';

// Mock categories data
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', color: 'bg-blue-500' },
  { id: '2', name: 'Clothing', color: 'bg-green-500' },
  { id: '3', name: 'Books', color: 'bg-purple-500' },
  { id: '4', name: 'Home & Garden', color: 'bg-yellow-500' },
  { id: '5', name: 'Sports', color: 'bg-red-500' },
  { id: '6', name: 'Beauty', color: 'bg-pink-500' },
  { id: '7', name: 'Automotive', color: 'bg-gray-500' },
  { id: '8', name: 'Toys', color: 'bg-orange-500' },
];

// Mock products data
let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'High-quality noise-cancelling wireless headphones',
    quantity: 25,
    categories: ['Electronics'],
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily exercise',
    quantity: 40,
    categories: ['Sports', 'Clothing'],
    createdAt: new Date('2024-01-20').toISOString(),
  },
  {
    id: '3',
    name: 'Programming Book',
    description: 'Complete guide to modern web development',
    quantity: 15,
    categories: ['Books'],
    createdAt: new Date('2024-01-25').toISOString(),
  },
  {
    id: '4',
    name: 'Garden Tools Set',
    description: 'Essential tools for garden maintenance',
    quantity: 8,
    categories: ['Home & Garden'],
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: '5',
    name: 'Smartphone',
    description: 'Latest smartphone with advanced features',
    quantity: 12,
    categories: ['Electronics'],
    createdAt: new Date('2024-02-05').toISOString(),
  },
];

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    await delay(300);
    return mockCategories;
  },

  // Get products with pagination and filters
  getProducts: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    categories?: string[];
  }): Promise<PaginatedResponse<Product>> => {
    await delay(500);
    
    const { page = 1, limit = 5, search = '', categories = [] } = params;
    
    let filteredProducts = [...mockProducts];
    
    // Filter by search term
    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filter by categories
    if (categories.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.categories.some(category => categories.includes(category))
      );
    }
    
    // Sort by creation date (newest first)
    filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
      data: paginatedProducts,
      totalPages,
      totalItems,
      currentPage: page,
      itemsPerPage: limit,
    };
  },

  // Create a new product
  createProduct: async (productData: CreateProductRequest): Promise<Product> => {
    await delay(800);
    
    // Check for duplicate name
    const existingProduct = mockProducts.find(
      product => product.name.toLowerCase() === productData.name.toLowerCase()
    );
    
    if (existingProduct) {
      throw new Error('Product name already exists');
    }
    
    const newProduct: Product = {
      id: (mockProducts.length + 1).toString(),
      ...productData,
      createdAt: new Date().toISOString(),
    };
    
    mockProducts.unshift(newProduct);
    return newProduct;
  },

  // Delete a product
  deleteProduct: async (productId: string): Promise<void> => {
    await delay(400);
    
    const productIndex = mockProducts.findIndex(product => product.id === productId);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    
    mockProducts.splice(productIndex, 1);
  },
};