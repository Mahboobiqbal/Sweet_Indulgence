import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", formData, "Role:", role);
    // Add your authentication logic here

    // Redirect based on role
    if (role === "supplier") {
      navigate("/supplier-dashboard"); // Redirect suppliers to their dashboard
    } else {
      navigate("/home"); // Redirect customers to the home page
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f5] py-16 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#e7dcca] p-6 text-center">
          <h2 className="text-3xl font-bold text-[#5e3023]">Welcome Back</h2>
          <p className="text-[#8c5f53] mt-2">Please login to your account</p>
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

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label htmlFor="email" className="block text-[#5e3023] font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-[#5e3023] font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-[#d3756b] focus:ring-[#d3756b] border-[#e7dcca] rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 text-[#8c5f53]">
                Remember me
              </label>
            </div>
            <a href="#" className="text-[#d3756b] hover:text-[#c25d52] font-medium">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#d3756b] hover:bg-[#c25d52] text-white py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
          >
            {role === "supplier" ? "SUPPLIER LOGIN" : "CUSTOMER LOGIN"}
          </button>

          <div className="text-center mt-8 text-[#8c5f53]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#d3756b] hover:text-[#c25d52] font-medium">
              Sign up
            </Link>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Login;
