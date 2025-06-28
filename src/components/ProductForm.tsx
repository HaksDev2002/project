import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, X } from "lucide-react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  createProduct,
  fetchCategories,
  fetchProducts,
  clearError,
  fetchProductById,
  editProduct,
} from "../store/slices/productsSlice";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { Formik, Form, Field, ErrorMessage as FormikError } from "formik";
import * as Yup from "yup";

type ProductFormValues = {
  name: string;
  description: string;
  quantity: number;
  categories: string[];
};

const ProductForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const isEditMode = Boolean(productId);

  const { categories, loading, error, selectedProduct } = useAppSelector(
    (state) => state.products
  );

  const initialValues = {
    name: "",
    description: "",
    quantity: 0,
    categories: [] as string[],
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Product name is required")
      .test("not-number", "Product name must be a string", (val) =>
        isNaN(Number(val))
      )
      .max(100, "Product name must be at most 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be greater than 0"),
    categories: Yup.array()
      .of(Yup.string())
      .min(1, "Please select at least one category"),
  });

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEditMode && productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, isEditMode, productId]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditMode && productId) {
        await dispatch(editProduct({ id: productId, data: values })).unwrap();
      } else {
        await dispatch(createProduct(values)).unwrap();
      }
      await dispatch(fetchProducts({ page: 1 }));
      navigate("/", { replace: true });
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? "Update existing product details"
              : "Create a new product in your inventory"}
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
        <Formik<ProductFormValues>
          initialValues={
            selectedProduct && isEditMode
              ? {
                  name: selectedProduct.name,
                  description: selectedProduct.description,
                  quantity: selectedProduct.quantity,
                  categories: selectedProduct.categories,
                }
              : initialValues
          }
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, isSubmitting, setFieldValue }) => (
            <Form className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <Field
                  type="text"
                  name="name"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter product name"
                />
                <FormikError
                  name="name"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter product description"
                />
                <FormikError
                  name="description"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <Field
                  type="number"
                  name="quantity"
                  min={0}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter quantity"
                />
                <FormikError
                  name="quantity"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories *
                </label>
                {values.categories.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {values.categories.map((categoryName) => {
                      const category = categories.find(
                        (cat) => cat.name === categoryName
                      );
                      return (
                        <span
                          key={categoryName}
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium text-white ${
                            category?.color || "bg-gray-500"
                          }`}
                        >
                          <span>{categoryName}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setFieldValue(
                                "categories",
                                values.categories.filter(
                                  (cat) => cat !== categoryName
                                )
                              )
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
                <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={values.categories.includes(category.name)}
                            onChange={() => {
                              const isSelected = values.categories.includes(
                                category.name
                              );
                              const updated = isSelected
                                ? values.categories.filter(
                                    (cat) => cat !== category.name
                                  )
                                : [...values.categories, category.name];
                              setFieldValue("categories", updated);
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${category.color}`}
                          />
                          <span className="text-sm text-gray-700">
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <FormikError
                  name="categories"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/")}
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
                      ? "Update Product"
                      : "Create Product"}
                  </span>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ProductForm;
