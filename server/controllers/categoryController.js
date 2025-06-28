import Category from "../models/Category.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 }).lean();

  const transformedCategories = categories.map((category) => ({
    id: category._id.toString(),
    name: category.name,
    color: category.color,
  }));

  res.status(200).json({
    status: "success",
    data: transformedCategories,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, color } = req.body;

  const category = await Category.create({
    name,
    color,
  });

  const transformedCategory = {
    id: category._id.toString(),
    name: category.name,
    color: category.color,
  };

  res.status(201).json({
    status: "success",
    data: transformedCategory,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, color } = req.body;

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  category.name = name || category.name;
  category.color = color || category.color;

  const updatedCategory = await category.save();

  const transformedCategory = {
    id: updatedCategory._id.toString(),
    name: updatedCategory.name,
    color: updatedCategory.color,
  };

  res.status(200).json({
    status: "success",
    data: transformedCategory,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  await Category.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Category deleted successfully",
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id).lean();

  if (!category) {
    return res.status(404).json({
      status: "error",
      message: "Category not found",
    });
  }

  const transformedCategory = {
    id: category._id.toString(),
    name: category.name,
    color: category.color,
  };

  res.status(200).json({
    status: "success",
    data: transformedCategory,
  });
});
