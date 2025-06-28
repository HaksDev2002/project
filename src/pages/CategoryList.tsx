import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import ErrorMessage from "../components/ErrorMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  clearError,
  deleteCategory,
  fetchCategories,
} from "../store/slices/categoriesSlice";

const CategoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = async (categoryId: string, categoryName: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you really want to delete "${categoryName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      dispatch(fetchCategories());

      Swal.fire("Deleted!", `"${categoryName}" has been deleted.`, "success");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading && categories.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Category Management
          </h1>
          <p className="text-gray-600 mt-1">
            {categories.length > 0
              ? `Manage your ${categories.length} categor${
                  categories.length !== 1 ? "ies" : "y"
                }`
              : "Start by creating your first category"}
          </p>
        </div>
        <Link
          to="/categories/add"
          className="mt-4 sm:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
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

      {categories.length === 0 && !loading ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories yet
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first category to organize your
            products.
          </p>
          <Link
            to="/categories/add"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/categories/edit/${category.id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit category"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-center py-8">
                  <div
                    className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-xl">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
