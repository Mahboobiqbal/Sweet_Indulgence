import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const AddProduct = () => {
    const { currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sale_price: '',
        category_id: '',
        stock_quantity: '',
        is_featured: false,
        is_active: true,
        image: null,
        loyalty_points_earned: ''
    });

    const [errors, setErrors] = useState({});

    // Categories - these should match your categories table
    const categories = [
        { id: 'cat1', name: 'Cakes' },
        { id: 'cat2', name: 'Cupcakes' },
        { id: 'cat3', name: 'Pastries' },
        { id: 'cat4', name: 'Cookies' },
        { id: 'cat5', name: 'Brownies' },
        { id: 'cat6', name: 'Tarts' },
        { id: 'cat7', name: 'Pies' },
        { id: 'cat8', name: 'Donuts' },
        { id: 'cat9', name: 'Breads' },
        { id: 'cat10', name: 'Custom Orders' },
        { id: 'cat11', name: 'Seasonal Specials' }
    ];

    // Check if user is authenticated and is a supplier
    if (!isAuthenticated || currentUser?.role !== 'supplier') {
        return (
            <div className="min-h-screen bg-[#fff9f5] py-16 px-4 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[#5e3023] mb-4">Access Denied</h1>
                    <p className="text-[#8c5f53] mb-6">You need to be logged in as a supplier to add products.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-[#d3756b] hover:bg-[#c25d52] text-white px-6 py-3 rounded-full font-bold transition-colors"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, PNG, WebP)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            setFormData(prev => ({ ...prev, image: file }));
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Product name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
        if (!formData.category_id) newErrors.category_id = 'Category is required';
        if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) newErrors.stock_quantity = 'Valid stock quantity is required';
        if (!formData.image) newErrors.image = 'Product image is required';

        // Validate sale price if provided
        if (formData.sale_price && parseFloat(formData.sale_price) >= parseFloat(formData.price)) {
            newErrors.sale_price = 'Sale price must be less than regular price';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsLoading(true);

        try {
            // Debug: Check if token exists
            const token = localStorage.getItem('token');
            console.log('Token exists:', !!token);
            console.log('Token preview:', token ? token.substring(0, 50) + '...' : 'No token');
            console.log('Current user:', currentUser);

            // Create FormData for file upload
            const productData = new FormData();
            
            // Append all form fields (only non-empty values)
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData[key]) {
                    productData.append('image', formData[key]);
                } else if (key !== 'image' && formData[key] !== '' && formData[key] !== null && formData[key] !== undefined) {
                    productData.append(key, formData[key]);
                }
            });

            // Debug: Log FormData contents
            console.log('FormData contents:');
            for (let pair of productData.entries()) {
                console.log(pair[0] + ': ' + (pair[1] instanceof File ? 'File: ' + pair[1].name : pair[1]));
            }

            const response = await axios.post('http://localhost:5000/api/products', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response:', response.data);

            if (response.data.success) {
                toast.success('Product added successfully!');
                // Reset form
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    sale_price: '',
                    category_id: '',
                    stock_quantity: '',
                    is_featured: false,
                    is_active: true,
                    image: null,
                    loyalty_points_earned: ''
                });
                setImagePreview(null);
                
                // Redirect to products page or dashboard after 2 seconds
                setTimeout(() => {
                    navigate('/supplier-dashboard');
                }, 2000);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            let errorMessage = 'Failed to add product. Please try again.';
            
            if (error.response?.status === 401) {
                errorMessage = 'Your session has expired. Please log in again.';
                // Optionally redirect to login
                // navigate('/login');
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff9f5] py-16 px-4">
            <ToastContainer position="top-right" />
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-[#e7dcca] mt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#5e3023] mb-2">Add New Product</h1>
                            <p className="text-[#8c5f53]">Add a new product to your store catalog</p>
                        </div>
                        <button
                            onClick={() => navigate('/supplier-dashboard')}
                            className="bg-[#e7dcca] hover:bg-[#d3c2a8] text-[#5e3023] px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-[#e7dcca]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label htmlFor="name" className="block text-[#5e3023] font-medium mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.name ? 'border-red-500' : 'border-[#e7dcca]'
                                    } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                                    placeholder="e.g., Chocolate Truffle Cake"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-[#5e3023] font-medium mb-2">
                                    Description *
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className={`w-full px-4 py-3 rounded-lg border ${
                                        errors.description ? 'border-red-500' : 'border-[#e7dcca]'
                                    } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                                    placeholder="Describe your product..."
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                            </div>

                            {/* Price and Sale Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-[#5e3023] font-medium mb-2">
                                        Price (Rs.) *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.price ? 'border-red-500' : 'border-[#e7dcca]'
                                        } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                                        placeholder="2500"
                                    />
                                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                                </div>
                                <div>
                                    <label htmlFor="sale_price" className="block text-[#5e3023] font-medium mb-2">
                                        Sale Price (Rs.)
                                    </label>
                                    <input
                                        type="number"
                                        id="sale_price"
                                        name="sale_price"
                                        value={formData.sale_price}
                                        onChange={handleInputChange}
                                        min="0"
                                        step="0.01"
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.sale_price ? 'border-red-500' : 'border-[#e7dcca]'
                                        } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                                        placeholder="2000 (optional)"
                                    />
                                    {errors.sale_price && <p className="text-red-500 text-sm mt-1">{errors.sale_price}</p>}
                                </div>
                            </div>

                            {/* Category and Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="category_id" className="block text-[#5e3023] font-medium mb-2">
                                        Category *
                                    </label>
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.category_id ? 'border-red-500' : 'border-[#e7dcca]'
                                        } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>}
                                </div>
                                <div>
                                    <label htmlFor="stock_quantity" className="block text-[#5e3023] font-medium mb-2">
                                        Stock Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        id="stock_quantity"
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        className={`w-full px-4 py-3 rounded-lg border ${
                                            errors.stock_quantity ? 'border-red-500' : 'border-[#e7dcca]'
                                        } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                                        placeholder="10"
                                    />
                                    {errors.stock_quantity && <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>}
                                </div>
                            </div>

                            {/* Loyalty Points */}
                            <div>
                                <label htmlFor="loyalty_points_earned" className="block text-[#5e3023] font-medium mb-2">
                                    Loyalty Points Earned
                                </label>
                                <input
                                    type="number"
                                    id="loyalty_points_earned"
                                    name="loyalty_points_earned"
                                    value={formData.loyalty_points_earned}
                                    onChange={handleInputChange}
                                    min="0"
                                    className="w-full px-4 py-3 rounded-lg border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
                                    placeholder="25"
                                />
                                <p className="text-sm text-[#8c5f53] mt-1">Points customers earn when purchasing this product</p>
                            </div>

                            {/* Product Options */}
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        name="is_featured"
                                        checked={formData.is_featured}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-[#d3756b] focus:ring-[#d3756b] border-[#e7dcca] rounded"
                                    />
                                    <label htmlFor="is_featured" className="ml-2 text-[#5e3023] font-medium">
                                        Featured Product
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-[#d3756b] focus:ring-[#d3756b] border-[#e7dcca] rounded"
                                    />
                                    <label htmlFor="is_active" className="ml-2 text-[#5e3023] font-medium">
                                        Active/Available for sale
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Product Image */}
                            <div>
                                <label htmlFor="image" className="block text-[#5e3023] font-medium mb-2">
                                    Product Image *
                                </label>
                                <div className="border-2 border-dashed border-[#e7dcca] rounded-lg p-6 text-center hover:border-[#d3756b] transition-colors">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-h-48 mx-auto rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setFormData(prev => ({ ...prev, image: null }));
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <svg className="mx-auto h-12 w-12 text-[#d3756b]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="mt-2 text-[#8c5f53]">Click to upload product image</p>
                                            <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="image"
                                        className="mt-4 inline-block bg-[#d3756b] hover:bg-[#c25d52] text-white px-4 py-2 rounded-lg cursor-pointer transition-colors"
                                    >
                                        Choose Image
                                    </label>
                                </div>
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/supplier-dashboard')}
                            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-[#5e3023] rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-3 bg-[#d3756b] hover:bg-[#c25d52] text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Product...
                                </span>
                            ) : (
                                'Add Product'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;