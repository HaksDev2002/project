import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateProductRequest, ProductsState } from "../../types";
import { api } from "../../utils/api";

const initialState: ProductsState = {
  products: [],
  categories: [],
  loading: false,
  error: null,
  searchTerm: "",
  selectedCategories: [],
  currentPage: 1,
  totalPages: 0,
  totalProducts: 0,
  selectedProduct: null,
  limit: 5,
};

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async () => {
    const categories = await api.getCategories();
    return categories;
  }
);

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: {
    page?: number;
    search?: string;
    categories?: string[];
    limit?: number;
  }) => {
    const response = await api.getProducts({
      page: params.page || 1,
      limit: params.limit || 5,
      search: params.search || "",
      categories: params.categories || [],
    });
    return response;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: CreateProductRequest) => {
    const product = await api.createProduct(productData);
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId: string) => {
    await api.deleteProduct(productId);
    return productId;
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId: string) => {
    const product = await api.getProductById(productId);
    return product;
  }
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, data }: { id: string; data: CreateProductRequest }) => {
    const updatedProduct = await api.editProduct(id, data);
    return updatedProduct;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSelectedCategories: (state, action: PayloadAction<string[]>) => {
      state.selectedCategories = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch categories";
      })

      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.totalProducts = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create product";
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete product";
      })

      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch product";
      })

      .addCase(editProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update product";
      });
  },
});

export const {
  setSearchTerm,
  setSelectedCategories,
  setCurrentPage,
  clearError,
  setLimit,
} = productsSlice.actions;

export default productsSlice.reducer;
