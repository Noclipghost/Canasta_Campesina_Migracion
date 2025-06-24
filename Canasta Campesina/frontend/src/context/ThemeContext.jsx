// frontend/src/context/ThemeContext.jsx - Actualizar el useEffect
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

/**
 * Proveedor de contexto para el tema de la aplicación
 * Maneja el cambio entre modo claro y oscuro
 */
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Aplicar tema al documento con transición suave
  useEffect(() => {
    const root = document.documentElement;
    
    // Agregar clase de transición temporalmente
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Aplicar el tema
    root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Remover la transición después de aplicar el tema
    setTimeout(() => {
      root.style.transition = '';
    }, 300);
  }, [isDarkMode]);

  /**
   * Alternar entre modo claro y oscuro
   */
  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const value = {
    isDarkMode,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto de tema
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser usado dentro de un ThemeProvider');
  }
  return context;
};
