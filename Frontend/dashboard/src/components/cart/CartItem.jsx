import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <li className="py-6 flex">
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
        <img
          src={item.product.imageUrl || '/api/placeholder/96/96'}
          alt={item.product.name}
          className="w-full h-full object-center object-cover"
        />
      </div>

      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.product.name}</h3>
            <p className="ml-4">${item.price.toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{item.product.description}</p>
        </div>
        
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex items-center">
            <button
              onClick={() => onQuantityChange(item.product.id, Math.max(0, item.quantity - 1))}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={item.quantity <= 1}
            >
              <Minus className="h-4 w-4 text-gray-500" />
            </button>
            
            <span className="mx-2 min-w-[2rem] text-center font-medium">
              {item.quantity}
            </span>
            
            <button
              onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={item.quantity >= item.product.stockQuantity}
            >
              <Plus className="h-4 w-4 text-gray-500" />
            </button>
          </div>

          <div className="flex items-center">
            <span className="text-gray-500 mr-4">
              Subtotal: ${(item.price * item.quantity).toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(item.product.id)}
              className="font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-1">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItem;