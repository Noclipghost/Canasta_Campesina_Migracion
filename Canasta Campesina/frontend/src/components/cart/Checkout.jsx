// frontend/src/components/cart/Checkout.jsx
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

/**
 * Componente Checkout - Proceso de pago
 */
const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    setIsProcessing(true);
    
    // Simular proceso de pago
    setTimeout(() => {
      alert('¡Pedido realizado con éxito!');
      clearCart();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="checkout">
      <button 
        className="btn btn-primary btn-full"
        onClick={handleCheckout}
        disabled={isProcessing || cartItems.length === 0}
      >
        {isProcessing ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            Procesando...
          </>
        ) : (
          'Realizar Pedido'
        )}
      </button>
    </div>
  );
};

export default Checkout;
