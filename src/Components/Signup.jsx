import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    if (role === "supplier") {
      navigate("/create-store"); // Redirect to store creation page
    } else {
      navigate("/home"); // Redirect customer to homepage
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg w-96">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
          Welcome to Sweet Indulgence
        </h2>

        {/* Role Selection */}
        <div className="mb-4 flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded ${
              role === "customer"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setRole("customer")}
          >
            Customer
          </button>
          <button
            className={`px-4 py-2 rounded ${
              role === "supplier"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setRole("supplier")}
          >
            Supplier
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignUp}>
          <label className="block mb-2 text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter your full name"
            required
          />

          <label className="block mb-2 text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter your email"
            required
          />

          <label className="block mb-2 text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mb-4"
            placeholder="Create a password"
            required
          />

          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600"
          >
            Sign Up as {role === "customer" ? "Customer" : "Supplier"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-pink-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
