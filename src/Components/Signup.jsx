import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    // Supplier specific fields
    businessName: "",
    businessAddress: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log("Sign up submitted:", formData);
    // Add your registration logic here

    if (role === "supplier") {
      navigate("/create-store"); // Redirect to store creation page
    } else {
      navigate("/home"); // Redirect customer to homepage
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f5] py-16 px-4">
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
                htmlFor="firstName"
                className="block text-[#5e3023] font-medium mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-[#5e3023] font-medium mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          {role === "supplier" && (
            <>
              <div className="mb-6">
                <label
                  htmlFor="businessName"
                  className="block text-[#5e3023] font-medium mb-2"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
                  placeholder="Your bakery name"
                  required={role === "supplier"}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="businessAddress"
                  className="block text-[#5e3023] font-medium mb-2"
                >
                  Business Address
                </label>
                <input
                  type="text"
                  id="businessAddress"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
                  placeholder="Your business address"
                  required={role === "supplier"}
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="phoneNumber"
                  className="block text-[#5e3023] font-medium mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
                  placeholder="Your contact number"
                  required={role === "supplier"}
                />
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
              className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              placeholder="Enter your email"
              required
            />
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
              className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              placeholder="Create a password"
              required
            />
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
              className="w-full px-4 py-3 rounded-full border border-[#e7dcca] focus:outline-none focus:ring-2 focus:ring-[#d3756b]"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="agreeTerms"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="h-4 w-4 text-[#d3756b] focus:ring-[#d3756b] border-[#e7dcca] rounded"
              required
            />
            <label
              htmlFor="agreeTerms"
              className="ml-2 text-[#8c5f53]"
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
            className="w-full bg-[#d3756b] hover:bg-[#c25d52] text-white py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105"
          >
            {role === "supplier" ? "CREATE SUPPLIER ACCOUNT" : "SIGN UP"}
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
