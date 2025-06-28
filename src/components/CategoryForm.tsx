import { ArrowLeft, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  clearError,
  createCategory,
  fetchCategoryById,
  updateCategory,
} from "../store/slices/categoriesSlice";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";

interface CategoryFormData {
  name: string;
  color: string;
}

const CategoryForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: categoryId } = useParams();
  const isEditMode = Boolean(categoryId);

  const { error } = useAppSelector((state) => state.categories);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    color: "bg-blue-500",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { name: "Blue", value: "bg-blue-500" },
    { name: "Green", value: "bg-green-500" },
    { name: "Purple", value: "bg-purple-500" },
    { name: "Yellow", value: "bg-yellow-500" },
    { name: "Red", value: "bg-red-500" },
    { name: "Pink", value: "bg-pink-500" },
    { name: "Gray", value: "bg-gray-500" },
    { name: "Orange", value: "bg-orange-500" },
    { name: "Emerald", value: "bg-emerald-500" },
    { name: "Indigo", value: "bg-indigo-500" },
    { name: "Cyan", value: "bg-cyan-500" },
    { name: "Teal", value: "bg-teal-500" },
  ];

  useEffect(() => {
    if (isEditMode && categoryId) {
      dispatch(fetchCategoryById(categoryId)).then((res: any) => {
        const category = res.payload;
        if (category) {
          setFormData({
            name: category.name,
            color: category.color,
          });
        }
      });
    }
  }, [dispatch, categoryId, isEditMode]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Category name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Category name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      errors.name = "Category name cannot exceed 50 characters";
    }

    if (!formData.color) {
      errors.color = "Please select a color";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && categoryId) {
        await dispatch(
          updateCategory({ id: categoryId, data: formData })
        ).unwrap();
      } else {
        await dispatch(createCategory(formData)).unwrap();
      }
      navigate("/categories", { replace: true });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate("/categories")}
          className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Category" : "Add New Category"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Update category information"
              : "Create a new category for your products"}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage
            message={error}
            onClose={() => dispatch(clearError())}
          />
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Category Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                formErrors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter category name"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {colorOptions.map((color) => (
                <label
                  key={color.value}
                  className="flex flex-col items-center space-y-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="color"
                    value={color.value}
                    checked={formData.color === color.value}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-8 h-8 rounded-full ${
                      color.value
                    } border-2 transition-all ${
                      formData.color === color.value
                        ? "border-gray-800 scale-110"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  />
                  <span className="text-xs text-gray-600">{color.name}</span>
                </label>
              ))}
            </div>
            {formErrors.color && (
              <p className="mt-1 text-sm text-red-600">{formErrors.color}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview
            </label>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full ${formData.color}`} />
                <span className="text-gray-900 font-medium">
                  {formData.name || "Category Name"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/categories")}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <LoadingSpinner
                  size="sm"
                  className="border-white border-t-transparent"
                />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Category"
                  : "Create Category"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
