import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-pink-600">Sweet Indulgence</div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-gray-700">
        <li>
          <a href="/" className="hover:text-pink-500">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="hover:text-pink-500">
            About
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-pink-500">
            Contact Us
          </a>
        </li>
      </ul>

      {/* Auth Buttons */}
      <div className="space-x-4">
        <button className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
          <Link to="/login">Login</Link>
        </button>
        <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
          <Link to="/signup">Sign Up</Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
