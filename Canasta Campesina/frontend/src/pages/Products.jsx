// frontend/src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';
import { getProducts, filterProducts } from '../services/api';

/**
 * Página de Productos - Muestra el catálogo de productos
 * Incluye filtros y vista en grid responsive
 */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    producer: '',
    location: '',
    priceMin: '',
    priceMax: '',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos al montar el componente
  useEffect(() => {
    loadProducts();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [filters]);

  /**
   * Cargar productos iniciales desde la API
   */
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Cargando productos iniciales...');
      
      const data = await getProducts();
      console.log('Productos cargados:', data);
      
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      setError('Error al cargar productos. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Aplicar filtros a los productos
   */
  const applyFilters = async () => {
    try {
      console.log('Aplicando filtros:', filters);
      
      // Verificar si hay algún filtro activo
      const hasActiveFilters = Object.values(filters).some(value => value !== '');
      
      if (hasActiveFilters) {
        setIsLoading(true);
        // Usar la función de filtrado del backend
        const filtered = await filterProducts(filters);
        console.log('Productos filtrados:', filtered);
        setFilteredProducts(filtered);
      } else {
        // Si no hay filtros, mostrar todos los productos
        console.log('Sin filtros activos, mostrando todos los productos');
        setFilteredProducts(products);
      }
    } catch (error) {
      console.error('Error al aplicar filtros:', error);
      setError('Error al filtrar productos. Mostrando todos los productos.');
      setFilteredProducts(products);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar cambios en los filtros
   * @param {Object} newFilters - Nuevos filtros aplicados
   */
  const handleFilterChange = (newFilters) => {
    console.log('Filtros actualizados:', newFilters);
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters
    }));
  };

  /**
   * Limpiar todos los filtros
   */
  const clearFilters = () => {
    console.log('Limpiando filtros');
    setFilters({
      category: '',
      producer: '',
      location: '',
      priceMin: '',
      priceMax: '',
      search: ''
    });
  };

  /**
   * Recargar productos
   */
  const handleReload = () => {
    loadProducts();
    clearFilters();
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Header de la página */}
        <div className="products-header">
          <h1>Nuestros Productos</h1>
          <p>Descubre la mejor selección de productos rurales frescos y de calidad</p>
          {error && (
            <div className="error-banner">
              <i className="fas fa-exclamation-triangle"></i>
              <span>{error}</span>
              <button onClick={handleReload} className="btn btn-sm btn-secondary">
                <i className="fas fa-redo"></i>
                Reintentar
              </button>
            </div>
          )}
        </div>

        <div className="products-content">
          {/* Sidebar con filtros */}
          <aside className="products-sidebar">
            <ProductFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              isLoading={isLoading}
            />
          </aside>

          {/* Grid de productos */}
          <main className="products-main">
            {/* Información de resultados */}
            <div className="products-results">
              <div className="results-info">
                {isLoading ? (
                  <p>Buscando productos...</p>
                ) : (
                  <p>
                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
                    {Object.values(filters).some(value => value !== '') && (
                      <span className="filter-indicator">
                        <i className="fas fa-filter"></i>
                        Filtros aplicados
                      </span>
                    )}
                  </p>
                )}
              </div>
              
              {/* Botón para limpiar filtros si están activos */}
              {Object.values(filters).some(value => value !== '') && (
                <button 
                  onClick={clearFilters}
                  className="btn btn-sm btn-outline"
                  disabled={isLoading}
                >
                  <i className="fas fa-times"></i>
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Contenido principal */}
            {isLoading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                <i className="fas fa-search"></i>
                <h3>No se encontraron productos</h3>
                <p>
                  {Object.values(filters).some(value => value !== '') 
                    ? 'Intenta ajustar los filtros de búsqueda' 
                    : 'No hay productos disponibles en este momento'
                  }
                </p>
                {Object.values(filters).some(value => value !== '') && (
                  <button onClick={clearFilters} className="btn btn-primary">
                    Ver todos los productos
                  </button>
                )}
              </div>
            ) : (
              <ProductGrid products={filteredProducts} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
