import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToCart, getCartCount } from "../utils/cartUtils";
import BakeHouse from "../assets/BakeHouse.png";

const PostLoginNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const { currentUser, logout } = useAuth();
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

  // Fetch wishlist and cart count for customers
  useEffect(() => {
    const fetchCounts = async () => {
      if (currentUser?.role === 'customer') {
        try {
          const token = localStorage.getItem('token');
          const headers = { 'Authorization': `Bearer ${token}` };
          
          // Fetch wishlist count
          const wishlistResponse = await fetch('http://localhost:5000/api/wishlist', { headers });
          if (wishlistResponse.ok) {
            const wishlistData = await wishlistResponse.json();
            if (wishlistData.success) {
              setWishlistCount(wishlistData.items?.length || 0);
            }
          }
          
          // Update cart count from localStorage
          setCartCount(getCartCount());
          
        } catch (error) {
          console.error('Error fetching counts:', error);
        }
      }
    };

    fetchCounts();
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      setCartCount(getCartCount());
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [currentUser]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Determine if user is a customer
  const isCustomer = currentUser?.role === "customer";
  // Determine if user is a supplier
  const isSupplier = currentUser?.role === "supplier";

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white text-[#5e3023] shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <img src={BakeHouse} alt="Bake House Logo" className="h-20 w-20" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/home"
              className={`${
                scrolled ? "text-[#5e3023]" : "text-white"
              } hover:text-[#d3756b] transition-colors font-medium`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`${
                scrolled ? "text-[#5e3023]" : "text-white"
              } hover:text-[#d3756b] transition-colors font-medium`}
            >
              Products
            </Link>

            {/* Customer-specific navigation items */}
            {isCustomer && (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className={`${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] transition-colors relative flex items-center space-x-2 group`}
                  title="My Wishlist"
                >
                  <svg
                    className="h-6 w-6 fill-current transition-colors group-hover:fill-red-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span className="font-medium">Wishlist</span>
                  {/* Wishlist count badge */}
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d3756b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                
                {/* Cart */}
                <Link
                  to="/cart"
                  className={`${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] transition-colors relative flex items-center space-x-2 group`}
                  title="Shopping Cart"
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
                  <span className="font-medium">Cart</span>
                  {/* Cart count badge */}
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#d3756b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                
                {/* User Dropdown */}
                <div className="relative group">
                  <button
                    className={`flex items-center space-x-1 ${
                      scrolled ? "text-[#5e3023]" : "text-white"
                    } hover:text-[#d3756b] font-medium`}
                  >
                    <span>{currentUser.first_name}</span>
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
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300`}
                  >
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
                      My Orders
                    </Link>
                    <Link
                      to="/about"
                      className="block px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/contact"
                      className="block px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      Contact Us
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
                  className={`${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] transition-colors font-medium`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/manage-products"
                  className={`${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] transition-colors font-medium`}
                >
                  My Products
                </Link>
                <Link
                  to="/manage-orders"
                  className={`${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] transition-colors font-medium`}
                >
                  Orders
                </Link>
                <div className="relative group">
                  <button
                    className={`flex items-center space-x-1 ${
                      scrolled ? "text-[#5e3023]" : "text-white"
                    } hover:text-[#d3756b] font-medium`}
                  >
                    <span>
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
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300`}
                  >
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
                    <Link
                      to="/about"
                      className="block px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/contact"
                      className="block px-4 py-2 text-sm text-[#5e3023] hover:bg-[#fff9f5]"
                    >
                      Contact Us
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
            className={`md:hidden ${
              scrolled ? "text-[#5e3023]" : "text-white"
            } focus:outline-none`}
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
              to="/home"
              className={`block py-2 ${
                scrolled ? "text-[#5e3023]" : "text-white"
              } hover:text-[#d3756b] font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`block py-2 ${
                scrolled ? "text-[#5e3023]" : "text-white"
              } hover:text-[#d3756b] font-medium`}
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>

            {/* Customer mobile menu items */}
            {isCustomer && (
              <>
                <Link
                  to="/wishlist"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] flex items-center gap-2 font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </Link>
                <Link
                  to="/cart"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] flex items-center gap-2 font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Cart {cartCount > 0 && `(${cartCount})`}
                </Link>
                <Link
                  to="/profile"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/about"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
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
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/manage-products"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Products
                </Link>
                <Link
                  to="/manage-orders"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/store-settings"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Store Settings
                </Link>
                <Link
                  to="/profile"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/about"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className={`block py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left py-2 ${
                    scrolled ? "text-[#5e3023]" : "text-white"
                  } hover:text-[#d3756b] font-medium`}
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

export default PostLoginNavbar;