// frontend/src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Componente Footer - Pie de página de la aplicación
 * Contiene información de contacto y enlaces importantes
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Canasta Campesina</h3>
            <p>Conectando productores rurales con consumidores urbanos</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Enlaces Rápidos</h4>
            <ul>
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/sobre-nosotros">Sobre Nosotros</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Contacto</h4>
            <div className="contact-info">
              <p><i className="fas fa-phone"></i> +57 300 123 4567</p>
              <p><i className="fas fa-envelope"></i> info@canastacampesina.com</p>
              <p><i className="fas fa-map-marker-alt"></i> Bogotá, Colombia</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Canasta Campesina. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
