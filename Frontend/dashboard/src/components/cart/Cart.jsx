import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import CartItem from './CartItem';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [userId]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts/user/${userId}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      setError('Failed to load cart. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts/user/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity })
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      fetchCart();
    } catch (err) {
      setError('Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts/user/${userId}/remove?productId=${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to remove item');
      fetchCart();
    } catch (err) {
      setError('Failed to remove item. Please try again.');
    }
  };

  const handleClearCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts/user/${userId}/clear`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to clear cart');
      fetchCart();
    } catch (err) {
      setError('Failed to clear cart. Please try again.');
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3 text-indigo-600" />
            Shopping Cart
          </h1>
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {cart && cart.cartItems.length > 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flow-root">
              <ul className="-my-6 divide-y divide-gray-200">
                {cart.cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Subtotal</p>
                <p>${cart.totalAmount?.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>

              <div className="mt-6 space-y-4">
                <button
                  onClick={handleCheckout}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Checkout
                </button>
                <button
                  onClick={handleClearCart}
                  className="w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Trash2 className="h-5 w-5 mr-2 text-gray-500" />
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start adding some items to your cart!
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/products')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Start Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;