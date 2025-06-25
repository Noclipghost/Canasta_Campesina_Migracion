// frontend/src/pages/About.jsx
import React from 'react';

/**
 * Página About - Información sobre Canasta Campesina
 * Describe los servicios y misión de la empresa
 */
const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="about-hero-content">
            <h1>Sobre Canasta Campesina</h1>
            <p className="about-subtitle">
              Conectando el campo con la ciudad, un producto a la vez
            </p>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="mission-vision">
          <div className="content-grid">
            <div className="mission-card">
              <div className="card-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h2>Nuestra Misión</h2>
              <p>
                Facilitar el acceso a productos rurales frescos y de calidad, 
                conectando directamente a productores campesinos independientes 
                con consumidores urbanos, promoviendo el comercio justo y 
                sostenible que beneficie a toda la cadena de valor.
              </p>
            </div>
            
            <div className="vision-card">
              <div className="card-icon">
                <i className="fas fa-eye"></i>
              </div>
              <h2>Nuestra Visión</h2>
              <p>
                Ser la plataforma líder en Colombia para la distribución de 
                productos campesinos, reconocida por promover la agricultura 
                sostenible, apoyar a las comunidades rurales y ofrecer a los 
                consumidores productos auténticos y de origen confiable.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestros Servicios */}
        <section className="services-section">
          <h2>Nuestros Servicios</h2>
          <div className="services-grid">
            <div className="service-item">
              <i className="fas fa-shopping-basket"></i>
              <h3>Distribución Directa</h3>
              <p>
                Conectamos directamente a productores campesinos con consumidores, 
                eliminando intermediarios y garantizando precios justos para ambas partes.
              </p>
            </div>
            
            <div className="service-item">
              <i className="fas fa-truck"></i>
              <h3>Logística Especializada</h3>
              <p>
                Contamos con una red logística especializada en productos perecederos, 
                asegurando que lleguen frescos desde la finca hasta tu hogar.
              </p>
            </div>
            
            <div className="service-item">
              <i className="fas fa-certificate"></i>
              <h3>Certificación de Calidad</h3>
              <p>
                Todos nuestros productos pasan por rigurosos controles de calidad 
                y contamos con certificaciones que garantizan su origen y frescura.
              </p>
            </div>
            
            <div className="service-item">
              <i className="fas fa-users"></i>
              <h3>Apoyo a Productores</h3>
              <p>
                Brindamos capacitación, asesoría técnica y apoyo financiero a 
                nuestros productores aliados para mejorar sus cultivos y procesos.
              </p>
            </div>
            
            <div className="service-item">
              <i className="fas fa-leaf"></i>
              <h3>Agricultura Sostenible</h3>
              <p>
                Promovemos prácticas agrícolas sostenibles que respeten el medio 
                ambiente y preserven la biodiversidad de nuestros campos.
              </p>
            </div>
            
            <div className="service-item">
              <i className="fas fa-handshake"></i>
              <h3>Comercio Justo</h3>
              <p>
                Garantizamos precios justos para los productores y productos 
                de calidad para los consumidores, creando relaciones comerciales éticas.
              </p>
            </div>
          </div>
        </section>

        {/* Nuestro Compromiso */}
        <section className="commitment-section">
          <div className="commitment-content">
            <div className="commitment-text">
              <h2>Nuestro Compromiso</h2>
              <p>
                En Canasta Campesina, creemos firmemente en el poder transformador 
                del comercio directo entre productores y consumidores. Nuestro 
                compromiso va más allá de la simple venta de productos; trabajamos 
                incansablemente para:
              </p>
              <ul>
                <li>
                  <i className="fas fa-check"></i>
                  Garantizar precios justos que dignifiquen el trabajo campesino
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Ofrecer productos frescos y de la más alta calidad a nuestros clientes
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Promover prácticas agrícolas sostenibles y responsables
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Fortalecer las economías rurales y reducir la migración campo-ciudad
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Preservar las tradiciones agrícolas y la diversidad de cultivos
                </li>
                <li>
                  <i className="fas fa-check"></i>
                  Construir puentes entre el campo y la ciudad
                </li>
              </ul>
            </div>
            <div className="commitment-image">
              <i className="fas fa-tractor"></i>
            </div>
          </div>
        </section>

        {/* Estadísticas */}
        <section className="stats-section">
          <h2>Nuestro Impacto</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Productores Aliados</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Departamentos Cubiertos</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Familias Beneficiadas</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Satisfacción del Cliente</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>Únete a Nuestra Comunidad</h2>
            <p>
              Forma parte del cambio hacia un sistema alimentario más justo y sostenible. 
              Descubre productos únicos y apoya a las familias campesinas de Colombia.
            </p>
            <div className="cta-buttons">
              <a href="/productos" className="btn btn-primary btn-large">
                Explorar Productos
              </a>
              <a href="/contacto" className="btn btn-secondary btn-large">
                Contáctanos
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
