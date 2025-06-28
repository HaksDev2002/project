import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 5, search = "", categories = "" } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  let query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (categories) {
    const categoryNames = categories.split(",").filter((cat) => cat.trim());
    if (categoryNames.length > 0) {
      const categoryDocs = await Category.find({
        name: { $in: categoryNames },
      }).select("_id");

      const categoryIds = categoryDocs.map((cat) => cat._id);
      if (categoryIds.length > 0) {
        query.categories = { $in: categoryIds };
      }
    }
  }

  const [products, totalItems] = await Promise.all([
    Product.find(query)
      .populate("categories", "name color")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(query),
  ]);

  const transformedProducts = products.map((product) => ({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    quantity: product.quantity,
    categories: product.categories.map((cat) => cat.name),
    createdAt: product.createdAt.toISOString(),
  }));

  const totalPages = Math.ceil(totalItems / limitNum);

  res.status(200).json({
    status: "success",
    data: {
      data: transformedProducts,
      totalPages,
      totalItems,
      currentPage: pageNum,
      itemsPerPage: limitNum,
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("categories", "name color")
    .lean();

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  const transformedProduct = {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    quantity: product.quantity,
    categories: product.categories.map((cat) => cat.name),
    createdAt: product.createdAt.toISOString(),
  };

  res.status(200).json({
    status: "success",
    data: transformedProduct,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, quantity, categories } = req.body;

  const categoryDocs = await Category.find({
    name: { $in: categories },
  });

  if (categoryDocs.length !== categories.length) {
    const foundCategories = categoryDocs.map((cat) => cat.name);
    const missingCategories = categories.filter(
      (cat) => !foundCategories.includes(cat)
    );
    return res.status(400).json({
      status: "error",
      message: `Categories not found: ${missingCategories.join(", ")}`,
    });
  }

  const categoryIds = categoryDocs.map((cat) => cat._id);

  const product = await Product.create({
    name,
    description,
    quantity,
    categories: categoryIds,
  });

  await product.populate("categories", "name color");

  const transformedProduct = {
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    quantity: product.quantity,
    categories: product.categories.map((cat) => cat.name),
    createdAt: product.createdAt.toISOString(),
  };

  res.status(201).json({
    status: "success",
    data: transformedProduct,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, categories } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  const categoryDocs = await Category.find({
    name: { $in: categories },
  });

  if (categoryDocs.length !== categories.length) {
    const foundCategories = categoryDocs.map((cat) => cat.name);
    const missingCategories = categories.filter(
      (cat) => !foundCategories.includes(cat)
    );
    return res.status(400).json({
      status: "error",
      message: `Categories not found: ${missingCategories.join(", ")}`,
    });
  }

  const categoryIds = categoryDocs.map((cat) => cat._id);

  product.name = name || product.name;
  product.description = description || product.description;
  product.quantity = quantity !== undefined ? quantity : product.quantity;
  product.categories = categoryIds;

  const updatedProduct = await product.save();
  await updatedProduct.populate("categories", "name color");

  const transformedProduct = {
    id: updatedProduct._id.toString(),
    name: updatedProduct.name,
    description: updatedProduct.description,
    quantity: updatedProduct.quantity,
    categories: updatedProduct.categories.map((cat) => cat.name),
    createdAt: updatedProduct.createdAt.toISOString(),
  };

  res.status(200).json({
    status: "success",
    data: transformedProduct,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }

  await Product.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});
