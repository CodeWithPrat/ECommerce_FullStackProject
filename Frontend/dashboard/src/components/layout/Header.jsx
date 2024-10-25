import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Bell, LogOut } from 'lucide-react';
import Navbar from './Navbar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulated cart count update
  useEffect(() => {
    // In real app, this would come from your cart state management
    setCartCount(3);
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Add your search logic here
    setShowSearch(false);
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    // Add your logout logic here
    setShowUserMenu(false);
    navigate('/login');
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
              alt="Amazon Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <div className="relative w-full max-w-xl">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent pl-12"
                />
                <Search className="absolute left-4 top-2.5 text-gray-400 h-5 w-5" />
              </form>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-6">
            {/* Cart */}
            <Link to="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 text-gray-700 group-hover:text-orange-500 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-1 focus:outline-none"
              >
                <User className="h-6 w-6 text-gray-700 hover:text-orange-500 transition-colors" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                        Login
                      </Link>
                      <Link to="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50">
                        Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pt-2 pb-4">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </form>
        </div>

        {/* Navigation */}
        <Navbar isOpen={isMobileMenuOpen} />
      </div>
    </header>
  );
};

export default Header;