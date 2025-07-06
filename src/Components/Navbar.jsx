import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-[#d3756b]" onClick={closeMenu}>
              Back House
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/"
                className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/products"
                    className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Products
                  </Link>
                  
                  {currentUser?.role === 'customer' && (
                    <>
                      <Link
                        to="/cart"
                        className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Cart
                      </Link>
                      <Link
                        to="/wishlist"
                        className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Wishlist
                      </Link>
                    </>
                  )}
                  
                  {currentUser?.role === 'supplier' && (
                    <Link
                      to="/supplier-dashboard"
                      className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Profile
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="bg-[#d3756b] hover:bg-[#c25d52] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[#5e3023] hover:text-[#d3756b] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-[#d3756b] hover:bg-[#c25d52] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#d3756b]"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Fixed background and text colors */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-[#e7dcca] shadow-lg">
            <Link
              to="/"
              className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={closeMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
              onClick={closeMenu}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/products"
                  className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Products
                </Link>
                
                {currentUser?.role === 'customer' && (
                  <>
                    <Link
                      to="/cart"
                      className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={closeMenu}
                    >
                      Cart
                    </Link>
                    <Link
                      to="/wishlist"
                      className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={closeMenu}
                    >
                      Wishlist
                    </Link>
                  </>
                )}
                
                {currentUser?.role === 'supplier' && (
                  <Link
                    to="/supplier-dashboard"
                    className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-[#d3756b] hover:bg-[#c25d52] text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[#5e3023] hover:text-[#d3756b] hover:bg-[#fff9f5] block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#d3756b] hover:bg-[#c25d52] text-white block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;