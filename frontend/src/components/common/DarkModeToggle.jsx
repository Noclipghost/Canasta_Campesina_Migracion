// frontend/src/components/common/DarkModeToggle.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Componente DarkModeToggle - Botón para alternar modo oscuro
 * Permite cambiar entre tema claro y oscuro
 */
const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button 
      className="dark-mode-toggle"
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${isDarkMode ? 'claro' : 'oscuro'}`}
      title={`Modo ${isDarkMode ? 'claro' : 'oscuro'}`}
    >
      <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
    </button>
  );
};

export default DarkModeToggle;
