import express from "express";
import { body } from "express-validator";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const productValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),
  body("description")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),
  body("quantity")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer"),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category must be selected")
    .custom((categories) => {
      if (
        !categories.every(
          (cat) => typeof cat === "string" && cat.trim().length > 0
        )
      ) {
        throw new Error("All categories must be valid strings");
      }
      return true;
    }),
];

// Routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", productValidation, validateRequest, createProduct);
router.put("/:id", productValidation, validateRequest, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
