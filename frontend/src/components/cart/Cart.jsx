// frontend/src/components/cart/Cart.jsx 
import React from 'react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

const Cart = () => {
  const { cartItems } = useCart();

  return (
    <div className="cart">
      <div className="cart-items">
        {cartItems.map(item => (
          <CartItem 
            key={item._id || `cart-item-${item.name}-${Math.random()}`} 
            item={item} 
          />
        ))}
      </div>
    </div>
  );
};

export default Cart;
