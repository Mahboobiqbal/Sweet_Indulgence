import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Store creation component
const CreateStore = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [storeName, setStoreName] = useState("My Bakery Shop");
  const [storeDescription, setStoreDescription] = useState("My bakery store");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeCity, setStoreCity] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const handleCreateStore = async () => {
    try {
      setIsCreating(true);
      setError("");
      
      const response = await fetch('http://localhost:5000/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: storeName,
          description: storeDescription,
          address: storeAddress,
          city: storeCity,
          phone: storePhone
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccess("Store created successfully! Refreshing...");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(data.message || "Failed to create store");
      }
    } catch (err) {
      setError("An error occurred while creating the store");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-[#5e3023] mb-4">Create Your Store</h1>
      <p className="text-[#8c5f53] mb-6">
        You need to create a store before you can add products.
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-[#5e3023] text-sm font-bold mb-2">
          Store Name
        </label>
        <input
          type="text"
          className="border rounded w-full py-2 px-3 text-gray-700"
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-[#5e3023] text-sm font-bold mb-2">
          Description
        </label>
        <textarea
          className="border rounded w-full py-2 px-3 text-gray-700"
          value={storeDescription}
          onChange={(e) => setStoreDescription(e.target.value)}
          rows="3"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-[#5e3023] text-sm font-bold mb-2">
          Store Address
        </label>
        <input
          type="text"
          className="border rounded w-full py-2 px-3 text-gray-700"
          value={storeAddress}
          onChange={(e) => setStoreAddress(e.target.value)}
          placeholder="123 Main St"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-[#5e3023] text-sm font-bold mb-2">
          City
        </label>
        <input
          type="text"
          className="border rounded w-full py-2 px-3 text-gray-700"
          value={storeCity}
          onChange={(e) => setStoreCity(e.target.value)}
          placeholder="Your City"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-[#5e3023] text-sm font-bold mb-2">
          Phone
        </label>
        <input
          type="text"
          className="border rounded w-full py-2 px-3 text-gray-700"
          value={storePhone}
          onChange={(e) => setStorePhone(e.target.value)}
          placeholder="555-123-4567"
        />
      </div>
      
      <button
        onClick={handleCreateStore}
        disabled={isCreating}
        className="bg-[#d3756b] hover:bg-[#c25d52] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        {isCreating ? "Creating..." : "Create Store"}
      </button>
    </div>
  );
};

// Supplier dashboard component
const SupplierDashboard = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const [hasStore, setHasStore] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [productStats, setProductStats] = useState({
      total_products: 0,
      featured_products: 0,
      out_of_stock: 0
    });
    
    // Show loading if not authenticated or user data not loaded
    if (!isAuthenticated || !currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fff9f5] to-[#f5e6d3] py-8 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d3756b] mx-auto mb-4"></div>
                    <p className="text-[#8c5f53]">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    useEffect(() => {
      // Check if user has a store
      const checkStore = async () => {
        try {
          setIsLoading(true);
          
          const response = await fetch('http://localhost:5000/api/stores/check', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
            console.error("Store check error status:", response.status);
            const errorData = await response.json();
            console.error("Error data:", errorData);
            setHasStore(false); // Default to no store on error
            return;
          }
          
          const data = await response.json();
          console.log("Store check response:", data);
          setHasStore(data.hasStore);
          
        } catch (err) {
          console.error("Error checking store:", err);
          setHasStore(false); // Default to no store on error
        } finally {
          setIsLoading(false);
        }
      };
      
      checkStore();
    }, []);

    useEffect(() => {
      const fetchProductStats = async () => {
        try {
          const response = await fetch('http://localhost:5000/api/products/stats', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (!response.ok) {
            console.error("Failed to fetch product stats:", response.status);
            return; // Keep default stats if request fails
          }
          
          const data = await response.json();
          if (data.success) {
            setProductStats(data.stats);
          }
        } catch (err) {
          console.error("Error fetching product stats:", err);
          // Keep default stats values if there's an error
        }
      };
      
      if (hasStore) {
        fetchProductStats();
      }
    }, [hasStore]);

    const handleAddProduct = () => {
        // Logic to handle adding a new product
        // navigate to AddProduct page
        window.location.href = '/add-product';
    }

    // In your render logic:
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!hasStore) {
      return <CreateStore />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff9f5] to-[#f5e6d3] py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#e7dcca] mt-16">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-[#5e3023] mb-2">
                                Supplier Dashboard
                            </h1>
                            <p className="text-xl text-[#8c5f53]">
                                Welcome back, {currentUser?.business_name || `${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || 'Supplier'}!
                            </p>
                            {/* Debug info - remove in production */}
                            <div className="mt-2 text-sm text-gray-500">
                                {/* <p>User ID: {currentUser?.user_id}</p> */}
                                <p>Email: {currentUser?.email}</p>
                                <p>Role: As a {currentUser?.role}</p>
                                <p>Business Name: {currentUser?.business_name || 'Not set'}</p>
                                <p className='text-sm text-red-500'>Verified: {currentUser?.is_verified ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#d3756b] to-[#c25d52] rounded-full flex items-center justify-center">
                                <span className="text-white text-2xl font-bold">
                                    {(currentUser?.business_name || currentUser?.first_name || 'U').charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Store Status Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e7dcca] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#5e3023]">Store Status</h2>
                            <div className="w-12 h-12 bg-gradient-to-br from-[#fff9f5] to-[#e7dcca] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#d3756b]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[#8c5f53]">Verification Status:</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                    currentUser?.is_verified 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-amber-100 text-amber-800'
                                }`}>
                                    {currentUser?.is_verified ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                            <button className="w-full mt-4 bg-gradient-to-r from-[#d3756b] to-[#c25d52] text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                Manage Store
                            </button>
                        </div>
                    </div>
                    
                    {/* Orders Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e7dcca] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#5e3023]">Orders</h2>
                            <div className="w-12 h-12 bg-gradient-to-br from-[#fff9f5] to-[#e7dcca] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#d3756b]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[#8c5f53]">New orders:</span>
                                <span className="text-2xl font-bold text-[#5e3023]">0</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[#8c5f53]">Processing:</span>
                                <span className="text-2xl font-bold text-[#d3756b]">0</span>
                            </div>
                            <button className="w-full mt-4 bg-gradient-to-r from-[#e7dcca] to-[#d3c2a8] text-[#5e3023] py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                Manage Orders
                            </button>
                        </div>
                    </div>
                    
                    {/* Products Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#e7dcca] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-[#5e3023]">Products</h2>
                            <div className="w-12 h-12 bg-gradient-to-br from-[#fff9f5] to-[#e7dcca] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-[#d3756b]" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[#8c5f53]">Total products:</span>
                                <span className="text-2xl font-bold text-[#5e3023]">{productStats.total_products}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[#8c5f53]">Featured:</span>
                              <span className="text-lg font-semibold text-[#d3756b]">{productStats.featured_products}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-[#8c5f53]">Out of stock:</span>
                              <span className="text-lg font-semibold text-red-500">{productStats.out_of_stock}</span>
                            </div>
                            <div className="mt-4 w-full bg-[#f5e6d3] rounded-full h-2">
                                <div className="bg-gradient-to-r from-[#d3756b] to-[#c25d52] h-2 rounded-full w-0"></div>
                            </div>
                            <button className="w-full mt-4 bg-gradient-to-r from-[#e7dcca] to-[#d3c2a8] text-[#5e3023] py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                Manage Products
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Quick Actions Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-[#e7dcca]">
                    <h2 className="text-2xl font-bold text-[#5e3023] mb-6 flex items-center">
                        <svg className="w-8 h-8 mr-3 text-[#d3756b]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                        </svg>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <button onClick={handleAddProduct} className="group bg-gradient-to-r from-[#d3756b] to-[#c25d52] text-white px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add New Product
                        </button>
                        <button className="group bg-gradient-to-r from-[#e7dcca] to-[#d3c2a8] text-[#5e3023] px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Update Store Hours
                        </button>
                        <button className="group bg-gradient-to-r from-[#fff9f5] to-[#f5e6d3] text-[#5e3023] px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center border border-[#e7dcca]">
                            <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                            </svg>
                            View Analytics
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupplierDashboard;