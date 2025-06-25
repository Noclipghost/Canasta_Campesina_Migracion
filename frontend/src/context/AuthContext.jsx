// frontend/src/context/AuthContext.jsx - Actualizar la función login
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  /**
   * Función para iniciar sesión con el backend real
   */
  const login = async (userData) => {
    try {
      console.log('Intentando login con:', userData);
      const result = await loginUser(userData);
      
      if (result.success) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
        
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        
        return { success: true, user: result.user };
      } else {
        throw new Error(result.message || 'Error en el login');
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
