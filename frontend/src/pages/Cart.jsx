// frontend/src/pages/Cart.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Cart from '../components/cart/Cart';
import Checkout from '../components/cart/Checkout';

/**
 * Página del Carrito - Muestra el carrito de compras y checkout
 */
const CartPage = () => {
  const { cartItems, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Mi Carrito</h1>
          <p>{cartItems.length} productos en tu carrito</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <i className="fas fa-shopping-cart"></i>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega algunos productos para comenzar tu compra</p>
            <a href="/productos" className="btn btn-primary">
              Ver Productos
            </a>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <Cart />
            </div>
            <div className="cart-summary">
              <div className="summary-card">
                <h3>Resumen del Pedido</h3>
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="summary-line">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="summary-line total">
                  <span>Total:</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                {isAuthenticated() ? (
                  <Checkout />
                ) : (
                  <div className="login-required">
                    <p>Inicia sesión para continuar con tu compra</p>
                    <a href="/login" className="btn btn-primary btn-full">
                      Iniciar Sesión
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
