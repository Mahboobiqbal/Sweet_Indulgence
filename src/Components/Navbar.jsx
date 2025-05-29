import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-[#e7dcca] shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-[#3b2a24]">Sweet Indulgence</div>

        {/* Hamburger menu for mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-[#3b2a24]">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation Links */}
        <ul
          className={`flex-col md:flex-row md:flex space-y-4 md:space-y-0 md:space-x-6 text-[#3b2a24] absolute md:static top-16 left-0 w-full md:w-auto bg-[#e7dcca] md:bg-transparent px-6 md:px-0 py-4 md:py-0 shadow-md md:shadow-none z-50 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          <li>
            <a href="/" className="hover:text-[#d3756b] block font-medium">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-[#d3756b] block font-medium">
              About
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-[#d3756b] block font-medium">
              Contact Us
            </a>
          </li>

          {/* Auth Buttons for mobile */}
          <div className="flex flex-col md:hidden space-y-2 mt-4">
            <Link
              to="/login"
              className="bg-[#d3756b] text-white px-4 py-2 rounded-full hover:bg-[#c25d52] text-center"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#3b2a24] text-white px-4 py-2 rounded-full hover:bg-[#594439] text-center"
            >
              Sign Up
            </Link>
          </div>
        </ul>

        {/* Auth Buttons for desktop */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="bg-[#d3756b] text-white px-4 py-2 rounded-full hover:bg-[#c25d52]"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-[#3b2a24] text-white px-4 py-2 rounded-full hover:bg-[#594439]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
