// frontend/src/pages/Admin.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProductManager from '../components/admin/ProductManager';
import CategoryManager from '../components/admin/CategoryManager';
import ProducerManager from '../components/admin/ProducerManager';
import LocationManager from '../components/admin/LocationManager';
import UserManager from '../components/admin/UserManager';

/**
 * Página de Administración - Panel de control para administradores
 * Permite gestionar productos, categorías, productores, ubicaciones y usuarios
 */
const Admin = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('productos');

  if (!isAdmin()) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <i className="fas fa-lock"></i>
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta página.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'productos':
        return <ProductManager />;
      case 'categorias':
        return <CategoryManager />;
      case 'productores':
        return <ProducerManager />;
      case 'ubicaciones':
        return <LocationManager />;
      case 'usuarios':
        return <UserManager />;
      default:
        return <ProductManager />;
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
          <p>Bienvenido, {user.name}</p>
        </div>

        <div className="admin-content">
          <nav className="admin-tabs">
            <button
              className={`tab-button ${activeTab === 'productos' ? 'active' : ''}`}
              onClick={() => setActiveTab('productos')}
            >
              <i className="fas fa-box"></i>
              Productos
            </button>
            <button
              className={`tab-button ${activeTab === 'categorias' ? 'active' : ''}`}
              onClick={() => setActiveTab('categorias')}
            >
              <i className="fas fa-tags"></i>
              Categorías
            </button>
            <button
              className={`tab-button ${activeTab === 'productores' ? 'active' : ''}`}
              onClick={() => setActiveTab('productores')}
            >
              <i className="fas fa-users"></i>
              Productores
            </button>
            <button
              className={`tab-button ${activeTab === 'ubicaciones' ? 'active' : ''}`}
              onClick={() => setActiveTab('ubicaciones')}
            >
              <i className="fas fa-map-marker-alt"></i>
              Ubicaciones
            </button>
            <button
              className={`tab-button ${activeTab === 'usuarios' ? 'active' : ''}`}
              onClick={() => setActiveTab('usuarios')}
            >
              <i className="fas fa-user-cog"></i>
              Usuarios
            </button>
          </nav>

          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
