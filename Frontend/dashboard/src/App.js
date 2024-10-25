import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/layout/Header'; // Updated import
import Footer from './components/layout/Footer'; // Updated import
import Navbar from './components/layout/Navbar'; // Updated import
import Login from './components/auth/Login'; // Updated import
import Register from './components/auth/Register'; // Updated import
import Cart from './components/cart/Cart'; // Updated import
import Home from './Pages/Home.jsx'; // Updated import
import Shop from './Pages/Shop.jsx'; // Updated import
import Profile from './Pages/Profile.jsx'; // Updated import
import Checkout from './Pages/Checkout.jsx'; // Updated import
import { Alert, AlertDescription } from './components/ui/alert'; // Adjust this as necessary
import { X } from 'lucide-react';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  // Simulate initial loading
  useEffect(() => {
    const initApp = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    initApp();
  }, []);

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Notification handler
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50">
            <Alert 
              className={`${
                notification.type === 'success' ? 'bg-green-50 border-green-500' :
                notification.type === 'error' ? 'bg-red-50 border-red-500' :
                'bg-blue-50 border-blue-500'
              } shadow-lg`}
            >
              <AlertDescription className="flex items-center justify-between">
                <span>{notification.message}</span>
                <button
                  onClick={() => setNotification(null)}
                  className="ml-4 text-gray-500 hover:text-gray-700"
                >
                  <X size={16} />
                </button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Header */}
        <Header className="bg-white shadow-sm">
          <Navbar />
        </Header>

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home showNotification={showNotification} />} />
            <Route path="/shop" element={<Shop showNotification={showNotification} />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile showNotification={showNotification} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <Checkout showNotification={showNotification} />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login showNotification={showNotification} />} />
            <Route path="/register" element={<Register showNotification={showNotification} />} />
            <Route path="/cart" element={<Cart showNotification={showNotification} />} />
            <Route path="*" element={
              <div className="text-center py-20">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h2>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <Footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Chronos Elite</h3>
                <p className="text-gray-400">
                  Crafting timeless luxury timepieces since 1980.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/shop" className="text-gray-400 hover:text-white">Shop</a></li>
                  <li><a href="/about" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
                <ul className="space-y-2">
                  <li><a href="/shipping" className="text-gray-400 hover:text-white">Shipping Info</a></li>
                  <li><a href="/returns" className="text-gray-400 hover:text-white">Returns</a></li>
                  <li><a href="/faq" className="text-gray-400 hover:text-white">FAQ</a></li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Stay Updated</h3>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
              <p>&copy; 2024 Chronos Elite. All rights reserved.</p>
            </div>
          </div>
        </Footer>
      </div>
    </Router>
  );
};

export default App;
