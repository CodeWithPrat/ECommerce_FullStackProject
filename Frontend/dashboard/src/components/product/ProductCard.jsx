import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product.id, 1);
  };

  return (
    <div 
      className="group relative bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-200 hover:-translate-y-1"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75">
        <img
          src={product.imageUrl || '/api/placeholder/300/400'}
          alt={product.name}
          className="w-full h-full object-center object-cover"
        />
      </div>
      
      <div className="px-4 py-4">
        <h3 className="text-lg font-medium text-gray-900 truncate">{product.name}</h3>
        
        <div className="mt-1 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">${product.price.toFixed(2)}</p>
          <p className={`text-sm ${
            product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.stockQuantity > 0 
              ? `${product.stockQuantity} in stock` 
              : 'Out of stock'}
          </p>
        </div>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-4 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/products/${product.id}`);
            }}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </button>
          
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className={`flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              product.stockQuantity > 0
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;