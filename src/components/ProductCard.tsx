import React, { useState } from "react";
import { Trash2, Calendar, Package, Pencil } from "lucide-react";
import { Product } from "../types";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { deleteProduct, fetchProducts } from "../store/slices/productsSlice";
import CategoryTag from "./CategoryTag";
import LoadingSpinner from "./LoadingSpinner";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { categories, currentPage, searchTerm, selectedCategories } =
    useAppSelector((state) => state.products);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await dispatch(deleteProduct(product.id)).unwrap();
      await dispatch(
        fetchProducts({
          page: currentPage,
          search: searchTerm,
          categories: selectedCategories,
        })
      );
    } catch (error) {
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => navigate(`/edit/${product.id}`)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit product"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete product"
            >
              {isDeleting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {product.categories.map((categoryName, index) => (
              <CategoryTag
                key={index}
                category={categoryName}
                categories={categories}
                size="sm"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Package className="h-4 w-4" />
              <span>Qty: {product.quantity}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(product.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
