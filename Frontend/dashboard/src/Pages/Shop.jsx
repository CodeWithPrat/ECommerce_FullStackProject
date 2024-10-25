import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/Card";
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from somewhere (e.g., auth context)
  const userId = 1; // Replace with actual user ID from auth

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/carts/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const data = await response.json();
      setCart(data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/user/${userId}/add?productId=${productId}&quantity=1`,
        { method: 'POST' }
      );
      if (!response.ok) throw new Error('Failed to add item to cart');
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      setError('Failed to add item to cart. Please try again.');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/carts/user/${userId}/remove?productId=${productId}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Failed to remove item from cart');
      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      setError('Failed to remove item from cart. Please try again.');
    }
  };

  const getItemQuantityInCart = (productId) => {
    if (!cart || !cart.cartItems) return 0;
    const cartItem = cart.cartItems.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cart Summary */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingCart className="mr-2" />
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
          </div>
          <div>
            <span className="font-medium">
              {cart?.totalItems || 0} items | Total: ${cart?.totalAmount || '0.00'}
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <img
                src={product.imageUrl || "/api/placeholder/300/200"}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardTitle className="mt-2">{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 line-clamp-2">{product.description}</p>
              <p className="mt-2 text-lg font-semibold">${product.price}</p>
              <p className="text-sm text-gray-500">
                Stock: {product.stockQuantity}
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              <div className="flex items-center justify-between w-full">
                {getItemQuantityInCart(product.id) > 0 ? (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(product.id)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 font-medium">
                      {getItemQuantityInCart(product.id)}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => addToCart(product.id)}
                      disabled={getItemQuantityInCart(product.id) >= product.stockQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => addToCart(product.id)}
                    disabled={product.stockQuantity === 0}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Shop;