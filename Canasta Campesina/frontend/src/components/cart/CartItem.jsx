// frontend/src/components/cart/CartItem.jsx - CORREGIDO
import React from 'react';
import { useCart } from '../../context/CartContext';

/**
 * Componente CartItem - Item individual del carrito
 */
const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity) => {
    updateQuantity(item._id, newQuantity); // CAMBIO: item.id → item._id
  };

  const handleRemove = () => {
    removeFromCart(item._id); // CAMBIO: item.id → item._id
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        <img src={item.image || '/images/placeholder.jpg'} alt={item.name} />
      </div>
      
      <div className="item-details">
        <h4>{item.name}</h4>
        <p>{item.description}</p>
        <p className="item-price">${item.price.toFixed(2)}</p>
      </div>
      
      <div className="item-quantity">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => handleQuantityChange(item.quantity + 1)}>
          +
        </button>
      </div>
      
      <div className="item-total">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
      
      <button className="remove-btn" onClick={handleRemove}>
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default CartItem;
