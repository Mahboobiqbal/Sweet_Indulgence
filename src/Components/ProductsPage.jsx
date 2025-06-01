import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  // State variables
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filter state
  const [filters, setFilters] = useState({
    category: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'newest',
    search: ''
  });

  // Fetch products with filters and pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', currentPage);
        
        if (filters.category) params.append('category_id', filters.category);
        if (filters.search) params.append('search', filters.search);
        if (filters.priceMin) params.append('price_min', filters.priceMin);
        if (filters.priceMax) params.append('price_max', filters.priceMax);
        
        // Map sort options to API parameters
        const sortMapping = {
          'newest': 'date_desc',
          'oldest': 'date_asc',
          'priceAsc': 'price_asc',
          'priceDesc': 'price_desc',
          'nameAsc': 'name_asc',
          'nameDesc': 'name_desc'
        };
        
        params.append('sort', sortMapping[filters.sortBy] || 'date_desc');
        
        // Make API request
        const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.products || []);
          setTotalPages(data.total_pages || 1);
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch categories with better error handling
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        
        if (!response.ok) {
          console.error("Failed to fetch categories:", response.status);
          return; // Don't update state if request fails
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
    fetchProducts();
  }, [currentPage, filters]);
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'newest',
      search: ''
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

  return (
    <div className="min-h-screen bg-[#fff9f5] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#5e3023]">Sweet Delights</h1>
          <p className="text-[#8c5f53] mt-2">Browse our delicious bakery products</p>
        </div>
        
        {/* Filters and Search Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
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
                {categories.map(cat => (
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
        
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3756b] mx-auto mb-4"></div>
            <p className="text-[#8c5f53]">Loading products...</p>
          </div>
        )}
        
        {error && !loading && (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#d3756b] text-white rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Products Grid */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <svg className="mx-auto h-16 w-16 text-[#e7dcca]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm0-4a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <h3 className="mt-2 text-lg font-semibold text-[#5e3023]">No products found</h3>
            <p className="text-[#8c5f53]">Try changing your filters or search term</p>
          </div>
        )}
        
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Link 
                to={`/product/${product.product_id}`}
                key={product.product_id}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-[#e7dcca]"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                  <img 
                    src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} 
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#5e3023] mb-1">{product.name}</h3>
                  <p className="text-sm text-[#8c5f53] mb-2 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      {product.sale_price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#d3756b]">
                            ₹{product.sale_price}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.price}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-[#5e3023]">
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                    
                    {product.is_featured && (
                      <span className="bg-[#f5e6d3] text-[#5e3023] text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-3 text-xs text-[#8c5f53]">
                    <span className="mr-3">{product.store_name}</span>
                    <span>{product.category_name}</span>
                  </div>
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
                className="px-3 py-1 rounded border border-[#e7dcca] bg-white disabled:opacity-50"
              >
                &lt;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    currentPage === page
                      ? 'bg-[#d3756b] text-white'
                      : 'border border-[#e7dcca] bg-white'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-[#e7dcca] bg-white disabled:opacity-50"
              >
                &gt;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;