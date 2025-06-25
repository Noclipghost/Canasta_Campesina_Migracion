// frontend/src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Página de Login - Formulario de inicio de sesión
 * Permite a los usuarios autenticarse en el sistema
 */
const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h1>
              <p>
                {isRegister 
                  ? 'Únete a nuestra comunidad de productos rurales'
                  : 'Accede a tu cuenta de Canasta Campesina'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && (
                <div className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {error}
                </div>
              )}

              {isRegister && (
                <div className="form-group">
                  <label htmlFor="name">Nombre Completo</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Ingresa tu nombre completo"
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Correo Electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Contraseña</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Ingresa tu contraseña"
                />
              </div>

              {isRegister && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Confirma tu contraseña"
                  />
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary btn-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {isRegister ? 'Creando cuenta...' : 'Iniciando sesión...'}
                  </>
                ) : (
                  isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'
                )}
              </button>
            </form>

            <div className="login-footer">
              <p>
                {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                <button 
                  type="button"
                  className="link-button"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </button>
              </p>
            </div>

            <div className="demo-credentials">
              <h4>Credenciales de Demostración:</h4>
              <p><strong>Admin:</strong> admin@canasta.com / admin123</p>
              <p><strong>Usuario:</strong> usuario@canasta.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
