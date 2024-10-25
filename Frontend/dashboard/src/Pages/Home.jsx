import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Featured product slides
  const slides = [
    {
      image: "/api/placeholder/1200/400",
      title: "New Arrivals",
      description: "Discover our latest collection"
    },
    {
      image: "/api/placeholder/1200/400",
      title: "Summer Sale",
      description: "Up to 50% off on selected items"
    },
    {
      image: "/api/placeholder/1200/400",
      title: "Premium Collection",
      description: "Luxury items for discerning tastes"
    }
  ];

  // Categories
  const categories = [
    { name: "Electronics", icon: "🖥️" },
    { name: "Fashion", icon: "👕" },
    { name: "Home & Living", icon: "🏠" },
    { name: "Books", icon: "📚" }
  ];

  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      const data = await response.json();
      setProducts(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const response = await fetch(`http://localhost:8080/api/carts/user/${userId}`);
        const cart = await response.json();
        setCartCount(cart.cartItems.length);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const addToCart = async (productId) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/carts/user/${userId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });

      if (response.ok) {
        fetchCartCount();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                className="sm:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/api/placeholder/32/32"
                  alt="TechMart"
                />
                <span className="ml-2 text-xl font-bold text-gray-800">TechMart</span>
              </div>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-8">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {category.icon} {category.name}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart
                  className="h-6 w-6 text-gray-600 cursor-pointer"
                  onClick={() => navigate('/cart')}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white border-b">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {categories.map((category) => (
              <button
                key={category.name}
                className="block w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Slider */}
      <div className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-xl">{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="text-lg font-medium">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8">Featured Products</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={product.imageUrl || "/api/placeholder/300/200"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">${product.price}</span>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">About TechMart</h3>
              <p className="text-gray-400">
                Your one-stop shop for all things tech. We provide quality products
                at competitive prices.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">Contact</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">Shipping Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">Returns</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  Facebook
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 TechMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;