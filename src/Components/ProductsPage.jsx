import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductsPage = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    category: "",
    priceMin: "",
    priceMax: "",
    sortBy: "newest",
    search: "",
  });

  // Fetch products with filters and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        params.append("page", currentPage);
        params.append("limit", 12); // Set items per page

        if (filters.category) params.append("category_id", filters.category);
        if (filters.search) params.append("search", filters.search);
        if (filters.priceMin) params.append("price_min", filters.priceMin);
        if (filters.priceMax) params.append("price_max", filters.priceMax);

        // Map sort options to API parameters
        const sortMapping = {
          newest: "date_desc",
          oldest: "date_asc",
          priceAsc: "price_asc",
          priceDesc: "price_desc",
          nameAsc: "name_asc",
          nameDesc: "name_desc",
        };

        params.append("sort", sortMapping[filters.sortBy] || "date_desc");

        // Make API request - Fixed URL with trailing slash
        const response = await fetch(
          `http://localhost:5000/api/products?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.products || []);
          setTotalProducts(data.pagination?.total || 0);
          setTotalPages(data.pagination?.pages || 1);
        } else {
          throw new Error(data.message || "Failed to fetch products");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters]);

  // Fetch categories separately (only once)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fixed URL with trailing slash
        const response = await fetch("http://localhost:5000/api/categories");

        if (!response.ok) {
          console.error("Failed to fetch categories:", response.status);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Continue without categories if there's an error
      }
    };

    fetchCategories();
  }, []); // Only run once on mount

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      priceMin: "",
      priceMax: "",
      sortBy: "newest",
      search: "",
    });
    setCurrentPage(1);
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  // Helper function to get product image URL
  const getProductImageUrl = (product) => {
    // Check if product has image_url (from primary image in product_images table)
    if (product.image_url) {
      // If it's a relative path, make it absolute
      if (product.image_url.startsWith("/uploads/")) {
        return `http://localhost:5000${product.image_url}`;
      }
      return product.image_url;
    }

    // Fallback to placeholder
    return "https://via.placeholder.com/300x300/f5e6d3/5e3023?text=No+Image";
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("LKR", "Rs.");
  };

  return (
    <div className="min-h-screen bg-[#fff9f5] py-12 px-4">
      <div className="max-w-7xl mx-auto mt-10">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#5e3023]">Sweet Delights</h1>
          <p className="text-[#8c5f53] mt-2">
            Browse our delicious bakery products
          </p>
          {totalProducts > 0 && (
            <p className="text-sm text-[#8c5f53] mt-1">
              {totalProducts} products found
            </p>
          )}
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-[#e7dcca]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="w-full md:w-1/3">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="px-4 py-2 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </select>

              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#e7dcca] hover:bg-[#d3c2a8] text-[#5e3023] rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#5e3023]">Price Range:</span>
              <input
                type="number"
                name="priceMin"
                value={filters.priceMin}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-24 px-3 py-1 rounded border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              />
              <span>-</span>
              <input
                type="number"
                name="priceMax"
                value={filters.priceMax}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-24 px-3 py-1 rounded border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3756b] mx-auto mb-4"></div>
            <p className="text-[#8c5f53]">Loading delicious products...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-4 max-w-md mx-auto">
              <h3 className="font-semibold mb-2">Oops! Something went wrong</h3>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => {
                setError(null);
                window.location.reload();
              }}
              className="px-6 py-2 bg-[#d3756b] hover:bg-[#c25d52] text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md border border-[#e7dcca]">
            <svg
              className="mx-auto h-16 w-16 text-[#e7dcca] mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-xl font-semibold text-[#5e3023] mb-2">
              No products found
            </h3>
            <p className="text-[#8c5f53] mb-4">
              {filters.search || filters.category || filters.priceMin || filters.priceMax
                ? "Try adjusting your filters or search terms"
                : "No products are currently available"}
            </p>
            {(filters.search || filters.category || filters.priceMin || filters.priceMax) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#d3756b] hover:bg-[#c25d52] text-white rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product.product_id}`}
                key={product.product_id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#e7dcca]"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-[#f5f5f5]">
                  <img
                    src={getProductImageUrl(product)}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300/f5e6d3/5e3023?text=No+Image";
                    }}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#5e3023] mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#8c5f53] mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price Section */}
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      {product.sale_price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#d3756b]">
                            {formatPrice(product.sale_price)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-[#5e3023]">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {product.is_featured && (
                      <span className="bg-[#f5e6d3] text-[#5e3023] text-xs px-2 py-1 rounded-full font-medium">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Store and Category Info */}
                  <div className="flex justify-between items-center text-xs text-[#8c5f53]">
                    <span className="font-medium">{product.store_name}</span>
                    <span className="bg-[#fff9f5] px-2 py-1 rounded">
                      {product.category_name}
                    </span>
                  </div>

                  {/* Stock Indicator */}
                  {product.stock_quantity !== undefined && (
                    <div className="mt-2">
                      {product.stock_quantity > 0 ? (
                        <span className="text-xs text-green-600">
                          {product.stock_quantity} in stock
                        </span>
                      ) : (
                        <span className="text-xs text-red-500">Out of stock</span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-[#e7dcca] bg-white hover:bg-[#f5e6d3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === pageNumber
                        ? "bg-[#d3756b] text-white"
                        : "border border-[#e7dcca] bg-white hover:bg-[#f5e6d3]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-[#e7dcca] bg-white hover:bg-[#f5e6d3] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </nav>

            {/* Page Info */}
            <div className="ml-4 text-sm text-[#8c5f53] self-center">
              Page {currentPage} of {totalPages} ({totalProducts} total products)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
