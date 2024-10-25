// ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import axios from 'axios';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Mock multiple product images
  const productImages = [
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400'
  ];

  useEffect(() => {
    fetchProductDetails();
    fetchRelatedProducts();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setRelatedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const addToCart = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`http://localhost:8080/api/carts/user/${userId}/add`, {
        productId: id,
        quantity: quantity
      });
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images Section */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="w-full rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(prev => (prev > 0 ? prev - 1 : productImages.length - 1))}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
            >
              <ChevronLeft />
            </button>
            <button
              onClick={() => setSelectedImage(prev => (prev < productImages.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg"
            >
              <ChevronRight />
            </button>
          </div>
          
          <div className="flex gap-2 overflow-x-auto">
            {productImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === index ? 'border-blue-500' : 'border-transparent'
                }`}
              >
                <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-gray-600">(150 reviews)</span>
            </div>
          </div>

          <p className="text-gray-600 text-lg">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Share2 className="w-6 h-6" />
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-4 py-2 border-r hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-4 py-2 border-l hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <span className="text-gray-600">
              {product.stockQuantity} items available
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={addToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <ShoppingCart />
              Add to Cart
            </button>
            <button className="flex-1 bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => navigate(`/product/${relatedProduct.id}`)}
            >
              <img
                src={relatedProduct.imageUrl || '/api/placeholder/400/300'}
                alt={relatedProduct.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {relatedProduct.name}
                </h3>
                <p className="text-blue-600 font-bold">
                  ${relatedProduct.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;