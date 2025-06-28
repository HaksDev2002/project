import express from "express";
import { body } from "express-validator";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const categoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Category name must be between 2 and 50 characters"),
  body("color")
    .matches(/^bg-\w+-\d{3}$/)
    .withMessage(
      "Color must be a valid Tailwind CSS class (e.g., bg-blue-500)"
    ),
];

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", categoryValidation, validateRequest, createCategory);
router.put("/:id", categoryValidation, validateRequest, updateCategory);
router.delete("/:id", deleteCategory);

export default router;
