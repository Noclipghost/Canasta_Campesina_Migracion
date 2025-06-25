// frontend/src/components/cart/CartDropdown.jsx - CORREGIDO
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartDropdown = () => {
  const { cartItems, removeFromCart, getCartTotal, isOpen, setIsOpen } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isOpen) return null;

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCloseCart = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="cart-overlay" onClick={handleCloseCart}></div>
      
      <div className="cart-dropdown">
        <div className="cart-header">
          <h3>Mi Carrito</h3>
          <button className="close-cart-btn" onClick={handleCloseCart}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-content">
          {cartItems.length === 0 ? (
            <div className="empty-cart-dropdown">
              <i className="fas fa-shopping-cart"></i>
              <p>Tu carrito está vacío</p>
              <Link to="/productos" className="btn btn-primary" onClick={handleCloseCart}>
                Ver Productos
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-items-dropdown">
                {cartItems.map(item => (
                  <div 
                    key={item._id || `dropdown-item-${item.name}-${Math.random()}`} 
                    className="cart-item-dropdown"
                  >
                    <div className="item-image-small">
                      <img 
                        src={item.image || '/images/placeholder.jpg'} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/images/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    <div className="item-details-small">
                      <h5>{item.name}</h5>
                      <p className="item-price-small">${item.price.toFixed(2)}</p>
                      <p className="item-quantity-small">Cantidad: {item.quantity}</p>
                    </div>
                    
                    <button 
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item._id)}
                      title="Eliminar producto"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="cart-summary-dropdown">
                <div className="total-line">
                  <strong>Total: ${getCartTotal().toFixed(2)}</strong>
                </div>
                
                <div className="cart-actions">
                  <Link 
                    to="/carrito" 
                    className="btn btn-primary btn-full"
                    onClick={handleCloseCart}
                  >
                    Ver Carrito Completo
                  </Link>
                  
                  {isAuthenticated() && (
                    <Link 
                      to="/carrito" 
                      className="btn btn-secondary btn-full"
                      onClick={handleCloseCart}
                    >
                      Proceder al Pago
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDropdown;
