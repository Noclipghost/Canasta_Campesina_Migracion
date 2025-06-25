// frontend/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Página de inicio de Canasta Campesina
 * Muestra información principal y enlaces de navegación
 */
const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>Bienvenido a Canasta Campesina</h1>
            <p className="hero-subtitle">
              Conectamos productores rurales con consumidores urbanos
            </p>
            <p className="hero-description">
              Descubre productos frescos, naturales y de calidad directamente 
              de nuestros productores campesinos. Apoya la economía local y 
              disfruta de sabores auténticos.
            </p>
            <div className="hero-actions">
              <Link to="/productos" className="btn btn-primary btn-large">
                Ver Productos
              </Link>
              {!isAuthenticated() && (
                <Link to="/login" className="btn btn-secondary btn-large">
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </div>
          <div className="hero-image">
            <i className="fas fa-shopping-basket"></i>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>¿Por qué elegir Canasta Campesina?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fas fa-leaf"></i>
              <h3>Productos Naturales</h3>
              <p>Productos cultivados sin químicos, respetando el medio ambiente</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-truck"></i>
              <h3>Entrega Fresca</h3>
              <p>Entregamos directamente desde la finca hasta tu mesa</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-handshake"></i>
              <h3>Apoyo Local</h3>
              <p>Apoya a los productores campesinos de tu región</p>
            </div>
            <div className="feature-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Calidad Garantizada</h3>
              <p>Todos nuestros productos pasan por controles de calidad</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
