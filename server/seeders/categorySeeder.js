import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import { connectDB } from "../config/database.js";

dotenv.config();

const categories = [
  { name: "Electronics", color: "bg-blue-500" },
  { name: "Clothing", color: "bg-green-500" },
  { name: "Books", color: "bg-purple-500" },
  { name: "Home & Garden", color: "bg-yellow-500" },
  { name: "Sports", color: "bg-red-500" },
  { name: "Beauty", color: "bg-pink-500" },
  { name: "Automotive", color: "bg-gray-500" },
  { name: "Toys", color: "bg-orange-500" },
  { name: "Health", color: "bg-emerald-500" },
  { name: "Music", color: "bg-indigo-500" },
];

const seedCategories = async () => {
  try {
    await connectDB();

    await Category.deleteMany({});

    const createdCategories = await Category.insertMany(categories);
    console.log(`Successfully seeded: ${createdCategories.length}`);

    createdCategories.forEach((category) => {
      console.log(`${category.name} (${category.color})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedCategories();
