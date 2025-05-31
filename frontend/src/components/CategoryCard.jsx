import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-50 group">
      <div className="p-6 flex flex-col flex-1">
        <div className="mb-4">
          {/* Category label badge */}
          <div className="inline-block bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm mb-4">
            <span className="text-xs font-semibold text-gray-700 tracking-wide">Category</span>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
            {category.name}
          </h3>
          
          {category.description ? (
            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
              {category.description}
            </p>
          ) : (
            <div className="flex items-center text-sm text-gray-400">
              <span className="font-medium">No description available</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50">
          <Link
            to={`/products-by-category/${category._id}`}
            className="flex items-center justify-between w-full bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl px-5 py-3 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white"
            aria-label={`View products in ${category.name}`}
          >
            <span className="font-semibold text-indigo-600 group-hover:text-white tracking-tight">View Products</span>
            <span className="text-indigo-600 text-lg font-medium group-hover:translate-x-2 group-hover:text-white transition-transform duration-300">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;