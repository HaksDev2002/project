import { Plus } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";
import SearchAndFilter from "../components/SearchAndFilter";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  clearError,
  fetchCategories,
  fetchProducts,
} from "../store/slices/productsSlice";

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    loading,
    error,
    currentPage,
    searchTerm,
    selectedCategories,
    totalProducts,
    limit,
  } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());

    dispatch(
      fetchProducts({
        page: currentPage,
        search: searchTerm,
        categories: selectedCategories,
        limit,
      })
    );
  }, [dispatch, currentPage, searchTerm, selectedCategories, limit]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Inventory
          </h1>
          <p className="text-gray-600 mt-1">
            {totalProducts > 0
              ? `Manage your ${totalProducts} product${
                  totalProducts !== 1 ? "s" : ""
                }`
              : "Start building your product inventory"}
          </p>
        </div>
        <Link
          to="/add"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onClose={() => dispatch(clearError())}
          />
        </div>
      )}

      <SearchAndFilter />

      {loading && products.length > 0 && (
        <div className="flex justify-center mb-4">
          <LoadingSpinner />
        </div>
      )}

      {products.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategories.length > 0
              ? "No products found"
              : "No products yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedCategories.length > 0
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by adding your first product to the inventory."}
          </p>
          <Link
            to="/add"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination />
        </>
      )}
    </div>
  );
};

export default ProductList;
