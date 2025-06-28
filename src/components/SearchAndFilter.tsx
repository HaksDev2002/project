import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import {
  setSearchTerm,
  setSelectedCategories,
} from "../store/slices/productsSlice";
import CategoryTag from "./CategoryTag";

const SearchAndFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, selectedCategories, categories } = useAppSelector(
    (state) => state.products
  );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleCategoryToggle = (categoryName: string) => {
    const updatedCategories = selectedCategories.includes(categoryName)
      ? selectedCategories.filter((cat) => cat !== categoryName)
      : [...selectedCategories, categoryName];

    dispatch(setSelectedCategories(updatedCategories));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center space-x-2 px-4 py-3 border rounded-lg font-medium transition-all ${
              selectedCategories.length > 0
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>Filter by Category</span>
            {selectedCategories.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-medium">
                {selectedCategories.length}
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-4">
                {/* Header row: Title + Clear all button area (always rendered) */}
                <div className="flex items-center justify-between mb-3 h-5">
                  <h3 className="font-medium text-gray-900">Categories</h3>
                  <div>
                    {selectedCategories.length > 0 ? (
                      <button
                        onClick={() => dispatch(setSelectedCategories([]))}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Clear all
                      </button>
                    ) : (
                      <div className="text-sm text-transparent">Clear all</div> // reserves space
                    )}
                  </div>
                </div>

                {/* Category List */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.name)}
                        onChange={() => handleCategoryToggle(category.name)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className={`inline-block w-3 h-3 rounded-full ${category.color}`}
                      />
                      <span className="text-sm text-gray-700 flex-1">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {selectedCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Active filters:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryName) => (
              <div key={categoryName} className="flex items-center">
                <CategoryTag
                  category={categoryName}
                  categories={categories}
                  size="sm"
                />
                <button
                  onClick={() => handleCategoryToggle(categoryName)}
                  className="ml-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
