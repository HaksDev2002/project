import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Category name must be at least 2 characters"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
    color: {
      type: String,
      required: [true, "Category color is required"],
      match: [/^bg-\w+-\d{3}$/, "Color must be a valid Tailwind CSS class"],
    },
  },
  {
    timestamps: true,
  }
);

categorySchema.index({ name: 1 });

export default mongoose.model("Category", categorySchema);
