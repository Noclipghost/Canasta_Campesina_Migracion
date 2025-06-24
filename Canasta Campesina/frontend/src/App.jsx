// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Login from './pages/Login';
import Admin from './pages/Admin';
import CartPage from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';

// Importar todos los estilos desde la carpeta styles
import './styles/variables.css';
import './styles/globals.css';
import './styles/components.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/darkmode.css';
import './styles/home.css';
import './styles/products.css';
import './styles/login.css';
import './styles/admin.css';
import './styles/cart.css';
import './styles/responsive.css';
import './styles/variables.css';
import './styles/globals.css';
import './styles/components.css';
import './styles/header.css';
import './styles/footer.css';
import './styles/darkmode.css';
import './styles/home.css';
import './styles/products.css';
import './styles/login.css';
import './styles/admin.css';
import './styles/cart.css';
import './styles/about.css';
import './styles/contact.css';
import './styles/responsive.css';

/**
 * Componente principal de la aplicación Canasta Campesina
 * Configura el enrutamiento y los proveedores de contexto globales
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div className="app">
              <Header />
              
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/productos" element={<Products />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/carrito" element={<CartPage />} />
                  <Route path="/sobre-nosotros" element={<About />} />
                  <Route path="/contacto" element={<Contact />} />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
