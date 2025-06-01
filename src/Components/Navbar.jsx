import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BakeHouse from "../assets/BakeHouse.png";
// import logo from "../assets/logo.png"; // Make sure you have a logo asset

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // // Add effect to navigate to dashboard when authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     if (currentUser?.role === "supplier") {
  //       navigate("/supplier-dashboard");
  //     } else if (currentUser?.role === "customer") {
  //       navigate("/dashboard");
  //     }
  //   }
  // }, [isAuthenticated, currentUser, navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Determine if user is a customer
  const isCustomer = isAuthenticated && currentUser?.role === "customer";
  // Determine if user is a supplier
  const isSupplier = isAuthenticated && currentUser?.role === "supplier";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white text-[#5e3023]  shadow-md py-2"
          : "bg-transprent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={BakeHouse} alt="Bake House Logo" className="h-20 w-20 " />
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-[#5e3023] hover:text-[#d3756b] transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-[#5e3023] hover:text-[#d3756b] transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-[#5e3023] hover:text-[#d3756b] transition-colors"
            >
              Contact
            </Link>

            {/* Show these links only if user is not authenticated */}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-full bg-[#e7dcca] text-[#5e3023] hover:bg-[#d3c2a8] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-full bg-[#d3756b] text-white hover:bg-[#c25d52] transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Customer-specific navigation items */}
            {isCustomer && (
              <>
                <Link
                  to="/dashboard"
                  className="text-[#5e3023] hover:text-[#d3756b] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/wishlist"
                  className="text-[#5e3023] hover:text-[#d3756b] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </Link>
                <Link
                  to="/cart"
                  className="text-[#5e3023] hover:text-[#d3756b] transition-colors relative"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 bg-[#d3756b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-[#5e3023] hover:text-[#d3756b]">
                    <span className="mr-1">{currentUser.first_name}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Supplier-specific navigation items */}
            {isSupplier && (
              <>
                <Link
                  to="/supplier-dashboard"
                  className="text-[#5e3023] hover:text-[#d3756b] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/manage-products"
                  className="text-[#5e3023] hover:text-[#d3756b] transition-colors"
                >
                  Products
                </Link>
                <Link
                  to="/manage-orders"
                  className="text-[#5e3023] hover:text-[#d3756b] transition-colors"
                >
                  Orders
                </Link>
                <div className="relative group">
                  <button className="flex items-center text-[#5e3023] hover:text-[#d3756b]">
                    <span className="mr-1">
                      {currentUser.business_name || currentUser.first_name}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                    <Link
                      to="/store-settings"
                      className="block px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      Store Settings
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-[#5e3023] focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <Link
              to="/"
              className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Customer mobile menu items */}
            {isCustomer && (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/wishlist"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cart
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-[#5e3023] hover:text-[#d3756b]"
                >
                  Logout
                </button>
              </>
            )}

            {/* Supplier mobile menu items */}
            {isSupplier && (
              <>
                <Link
                  to="/supplier-dashboard"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/manage-products"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/manage-orders"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/store-settings"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Store Settings
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-[#5e3023] hover:text-[#d3756b]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 text-[#5e3023] hover:text-[#d3756b]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
