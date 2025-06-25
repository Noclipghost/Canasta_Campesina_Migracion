// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/variables.css';

/**
 * Punto de entrada principal de la aplicación React
 * Renderiza el componente App en el elemento root del DOM
 */

// Crear el root de React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizar la aplicación
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Registrar service worker para PWA (opcional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registrado: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registro falló: ', registrationError);
      });
  });
}
