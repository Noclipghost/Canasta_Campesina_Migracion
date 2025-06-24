// frontend/src/pages/Contact.jsx
import React, { useState } from 'react';

/**
 * Página Contact - Formulario de contacto y información
 * Permite a los usuarios enviar mensajes a Canasta Campesina
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simular envío del formulario (aquí se conectaría con el backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular éxito
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Header */}
        <section className="contact-header">
          <h1>Contáctanos</h1>
          <p>
            Estamos aquí para ayudarte. Envíanos tu mensaje y te responderemos 
            lo más pronto posible.
          </p>
        </section>

        <div className="contact-content">
          {/* Formulario de Contacto */}
          <div className="contact-form-section">
            <div className="form-container">
              <h2>Envíanos un Mensaje</h2>
              
              {submitStatus === 'success' && (
                <div className="success-message">
                  <i className="fas fa-check-circle"></i>
                  ¡Mensaje enviado exitosamente! Te responderemos pronto.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  Error al enviar el mensaje. Por favor, intenta nuevamente.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Nombre Completo *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Asunto *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="consulta-productos">Consulta sobre productos</option>
                    <option value="problemas-pedido">Problemas con mi pedido</option>
                    <option value="convertirse-productor">Quiero ser productor aliado</option>
                    <option value="sugerencias">Sugerencias y comentarios</option>
                    <option value="soporte-tecnico">Soporte técnico</option>
                    <option value="otros">Otros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Mensaje *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Escribe tu mensaje aquí. Incluye todos los detalles que consideres importantes para que podamos ayudarte mejor."
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Enviando mensaje...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="contact-info-section">
            <div className="info-container">
              <h2>Información de Contacto</h2>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="method-details">
                    <h3>Correo Electrónico</h3>
                    <p>info@canastacampesina.com</p>
                    <p>soporte@canastacampesina.com</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="method-details">
                    <h3>Teléfono</h3>
                    <p>+57 (1) 234-5678</p>
                    <p>Línea WhatsApp: +57 300 123 4567</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="method-details">
                    <h3>Dirección</h3>
                    <p>Carrera 15 #93-47, Oficina 501</p>
                    <p>Bogotá, Colombia</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="method-details">
                    <h3>Horarios de Atención</h3>
                    <p>Lunes a Viernes: 8:00 AM - 6:00 PM</p>
                    <p>Sábados: 9:00 AM - 2:00 PM</p>
                    <p>Domingos: Cerrado</p>
                  </div>
                </div>
              </div>

              {/* Redes Sociales */}
              <div className="social-section">
                <h3>Síguenos en Redes Sociales</h3>
                <div className="social-links">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-facebook"></i>
                    Facebook
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-instagram"></i>
                    Instagram
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-twitter"></i>
                    Twitter
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-linkedin"></i>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Preguntas Frecuentes</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>¿Cómo puedo hacer un pedido?</h3>
              <p>
                Puedes hacer tu pedido directamente desde nuestra página web, 
                agregando productos al carrito y siguiendo el proceso de checkout.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>¿Cuál es el tiempo de entrega?</h3>
              <p>
                El tiempo de entrega varía según tu ubicación, pero generalmente 
                es de 24 a 48 horas en Bogotá y 2 a 5 días en otras ciudades.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>¿Cómo puedo ser productor aliado?</h3>
              <p>
                Si eres productor y quieres unirte a nuestra red, contáctanos 
                seleccionando "Quiero ser productor aliado" en el formulario.
              </p>
            </div>
            
            <div className="faq-item">
              <h3>¿Ofrecen garantía en los productos?</h3>
              <p>
                Sí, garantizamos la calidad de todos nuestros productos. Si no 
                estás satisfecho, contáctanos dentro de las 24 horas posteriores a la entrega.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
