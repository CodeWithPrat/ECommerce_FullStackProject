import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const Navbar = ({ isOpen }) => {
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Navigation items with dropdowns
  const navItems = [
    {
      label: 'Categories',
      path: '/categories',
      dropdown: [
        { label: 'Electronics', path: '/categories/electronics' },
        { label: 'Fashion', path: '/categories/fashion' },
        { label: 'Home & Garden', path: '/categories/home-garden' },
        { label: 'Books', path: '/categories/books' },
      ],
    },
    {
      label: 'Deals',
      path: '/deals',
      dropdown: [
        { label: 'Today\'s Deals', path: '/deals/today' },
        { label: 'Clearance', path: '/deals/clearance' },
        { label: 'Bundle & Save', path: '/deals/bundles' },
      ],
    },
    { label: 'New Arrivals', path: '/new-arrivals' },
    { label: 'Best Sellers', path: '/best-sellers' },
    { label: 'Customer Service', path: '/customer-service' },
  ];

  const handleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <nav className={`transition-all duration-300 ${isOpen ? 'block' : 'hidden md:block'}`}>
      <div className="border-t border-gray-200 py-2">
        <ul className="flex flex-col md:flex-row md:space-x-8">
          {navItems.map((item, index) => (
            <li key={item.path} className="relative group">
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => handleDropdown(index)}
                    className={`flex items-center py-2 px-3 text-sm font-medium w-full md:w-auto ${
                      location.pathname.startsWith(item.path)
                        ? 'text-orange-500'
                        : 'text-gray-700 hover:text-orange-500'
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${
                      activeDropdown === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className={`${
                    activeDropdown === index ? 'block' : 'hidden'
                  } md:hidden md:group-hover:block absolute left-0 mt-0 md:mt-2 w-48 bg-white shadow-lg rounded-md z-50`}>
                    <div className="py-2">
                      {item.dropdown.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.path}
                          to={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                        >
                          {dropdownItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`block py-2 px-3 text-sm font-medium ${
                    location.pathname === item.path
                      ? 'text-orange-500'
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;