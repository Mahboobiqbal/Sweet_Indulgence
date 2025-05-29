import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUpPage = () => {
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    // Supplier specific fields
    business_name: "",
    business_address: "",
    business_phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate common fields
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms";
    
    // Validate supplier fields
    if (role === "supplier") {
      if (!formData.business_name.trim()) newErrors.business_name = "Business name is required";
      if (!formData.business_address.trim()) newErrors.business_address = "Business address is required";
      if (!formData.business_phone.trim()) newErrors.business_phone = "Phone number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for API
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      };
      
      // Add supplier fields if registering as supplier
      if (role === "supplier") {
        userData.business_name = formData.business_name;
        userData.business_address = formData.business_address;
        userData.business_phone = formData.business_phone;
      }
      
      // Call appropriate API endpoint based on role
      let response;
      if (role === "supplier") {
        response = await authService.registerSupplier(userData);
      } else {
        response = await authService.registerCustomer(userData);
      }
      
      toast.success("Registration successful!");
      
      // Navigate to the appropriate page
      if (role === "supplier") {
        navigate("/create-store");
      } else {
        navigate("/");
      }
      
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f5] py-16 px-4">
      <ToastContainer position="top-right" />
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#e7dcca] p-6 text-center">
          <h2 className="text-3xl font-bold text-[#5e3023]">
            Create Account
          </h2>
          <p className="text-[#8c5f53] mt-2">
            Join our sweet community today
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-4 mt-6 flex justify-center space-x-4">
          <button
            type="button"
            className={`px-6 py-2 rounded-full transition-all duration-200 ${
              role === "customer"
                ? "bg-[#d3756b] text-white shadow-md"
                : "bg-gray-200 text-[#5e3023] hover:bg-gray-300"
            }`}
            onClick={() => setRole("customer")}
          >
            Customer
          </button>
          <button
            type="button"
            className={`px-6 py-2 rounded-full transition-all duration-200 ${
              role === "supplier"
                ? "bg-[#d3756b] text-white shadow-md"
                : "bg-gray-200 text-[#5e3023] hover:bg-gray-300"
            }`}
            onClick={() => setRole("supplier")}
          >
            Supplier
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignUp} className="p-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label
                htmlFor="first_name"
                className="block text-[#5e3023] font-medium mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-full border ${
                  errors.first_name ? 'border-red-500' : 'border-[#e7dcca]'
                } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                placeholder="First Name"
              />
              {errors.first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-[#5e3023] font-medium mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-full border ${
                  errors.last_name ? 'border-red-500' : 'border-[#e7dcca]'
                } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                placeholder="Last Name"
              />
              {errors.last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          {role === "supplier" && (
            <>
              <div className="mb-6">
                <label
                  htmlFor="business_name"
                  className="block text-[#5e3023] font-medium mb-2"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-full border ${
                    errors.business_name ? 'border-red-500' : 'border-[#e7dcca]'
                  } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                  placeholder="Your bakery name"
                />
                {errors.business_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.business_name}</p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="business_address"
                  className="block text-[#5e3023] font-medium mb-2"
                >
                  Business Address
                </label>
                <input
                  type="text"
                  id="business_address"
                  name="business_address"
                  value={formData.business_address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-full border ${
                    errors.business_address ? 'border-red-500' : 'border-[#e7dcca]'
                  } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                  placeholder="Your business address"
                />
                {errors.business_address && (
                  <p className="text-red-500 text-sm mt-1">{errors.business_address}</p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="business_phone"
                  className="block text-[#5e3023] font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="business_phone"
                  name="business_phone"
                  value={formData.business_phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-full border ${
                    errors.business_phone ? 'border-red-500' : 'border-[#e7dcca]'
                  } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
                  placeholder="Your contact number"
                />
                {errors.business_phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.business_phone}</p>
                )}
              </div>
            </>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-[#5e3023] font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-full border ${
                errors.email ? 'border-red-500' : 'border-[#e7dcca]'
              } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-[#5e3023] font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-full border ${
                errors.password ? 'border-red-500' : 'border-[#e7dcca]'
              } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-[#5e3023] font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-full border ${
                errors.confirmPassword ? 'border-red-500' : 'border-[#e7dcca]'
              } focus:outline-none focus:ring-2 focus:ring-[#d3756b]`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className={`h-4 w-4 text-[#d3756b] focus:ring-[#d3756b] border-[#e7dcca] rounded ${
                errors.agreeTerms ? 'border-red-500' : ''
              }`}
            />
            <label
              htmlFor="agreeTerms"
              className={`ml-2 ${errors.agreeTerms ? 'text-red-500' : 'text-[#8c5f53]'}`}
            >
              I agree to the{" "}
              <a
                href="#"
                className="text-[#d3756b] hover:text-[#c25d52]"
              >
                Terms and Conditions
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#d3756b] hover:bg-[#c25d52] text-white py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              role === "supplier" ? "CREATE SUPPLIER ACCOUNT" : "SIGN UP"
            )}
          </button>

          <div className="text-center mt-8 text-[#8c5f53]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#d3756b] hover:text-[#c25d52] font-medium"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;