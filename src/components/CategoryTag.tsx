import React from "react";
import { Category } from "../types";

interface CategoryTagProps {
  category: string;
  categories: Category[];
  size?: "sm" | "md";
}

const CategoryTag: React.FC<CategoryTagProps> = ({
  category,
  categories,
  size = "md",
}) => {
  const categoryData = categories.find((cat) => cat.name === category);
  const colorClass = categoryData?.color || "bg-gray-500";

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${colorClass} text-white font-medium ${sizeClasses[size]}`}
    >
      {category}
    </span>
  );
};

export default CategoryTag;
