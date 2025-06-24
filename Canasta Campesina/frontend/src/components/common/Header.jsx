// frontend/src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import DarkModeToggle from './DarkModeToggle';
import CartDropdown from '../cart/CartDropdown';

/**
 * Componente Header - Encabezado principal de la aplicación
 * Incluye navegación, carrito, autenticación y modo oscuro
 */
const Header = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartItemsCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    toggleCart();
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <i className="fas fa-shopping-basket"></i>
            <span>Canasta Campesina</span>
          </Link>

          <nav className="nav-desktop">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/productos" className="nav-link">Productos</Link>
            {isAuthenticated() && isAdmin() && (
              <Link to="/admin" className="nav-link">Administración</Link>
            )}
          </nav>

          <div className="header-actions">
            <DarkModeToggle />

            <div className="cart-container">
              <button className="cart-button" onClick={handleCartClick}>
                <i className="fas fa-shopping-cart"></i>
                {getCartItemsCount() > 0 && (
                  <span className="cart-badge">{getCartItemsCount()}</span>
                )}
              </button>
              <CartDropdown />
            </div>

            {isAuthenticated() ? (
              <div className="user-menu">
                <span className="user-name">Hola, {user.name}</span>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Iniciar Sesión
              </Link>
            )}

            <button 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="nav-mobile">
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Inicio
            </Link>
            <Link to="/productos" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Productos
            </Link>
            {isAuthenticated() && isAdmin() && (
              <Link to="/admin" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Administración
              </Link>
            )}
            {!isAuthenticated() && (
              <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                Iniciar Sesión
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
