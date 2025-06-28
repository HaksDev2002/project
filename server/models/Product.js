import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "At least one category is required"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ categories: 1 });
productSchema.index({ createdAt: -1 });

productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const existingProduct = await this.constructor.findOne({
      name: { $regex: new RegExp(`^${this.name}$`, "i") },
      _id: { $ne: this._id },
    });

    if (existingProduct) {
      const error = new Error("Product name already exists");
      error.statusCode = 400;
      return next(error);
    }
  }
  next();
});

export default mongoose.model("Product", productSchema);
