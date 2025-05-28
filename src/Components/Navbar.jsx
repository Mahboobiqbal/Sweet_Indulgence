import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-pink-600">Sweet Indulgence</div>

      {/* Hamburger menu for mobile */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Navigation Links */}
      <ul
        className={`flex-col md:flex-row md:flex space-y-4 md:space-y-0 md:space-x-6 text-gray-700 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent px-6 md:px-0 py-4 md:py-0 shadow-md md:shadow-none ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <li>
          <a href="/" className="hover:text-pink-500 block">
            Home
          </a>
        </li>
        <li>
          <a href="/about" className="hover:text-pink-500 block">
            About
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-pink-500 block">
            Contact Us
          </a>
        </li>

        {/* Auth Buttons for mobile */}
        <div className="flex flex-col md:hidden space-y-2 mt-4">
          <Link
            to="/login"
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 text-center"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-center"
          >
            Sign Up
          </Link>
        </div>
      </ul>

      {/* Auth Buttons for desktop */}
      <div className="hidden md:flex space-x-4">
        <Link
          to="/login"
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
