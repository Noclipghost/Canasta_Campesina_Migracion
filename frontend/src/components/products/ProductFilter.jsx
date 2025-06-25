// frontend/src/components/products/ProductFilter.jsx
import React, { useState, useEffect } from 'react';
import { getCategories, getProducers, getLocations } from '../../services/api';

/**
 * Componente ProductFilter - Filtros para productos
 * Permite filtrar productos por categoría, productor, ubicación y precio
 */
const ProductFilter = ({ filters, onFilterChange, onClearFilters, isLoading }) => {
  const [categories, setCategories] = useState([]);
  const [producers, setProducers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [filterErrors, setFilterErrors] = useState({});

  useEffect(() => {
    loadFilterData();
  }, []);

  /**
   * Cargar datos para los filtros desde la API
   */
  const loadFilterData = async () => {
    try {
      setLoadingFilters(true);
      setFilterErrors({});
      
      console.log('Cargando datos para filtros...');
      
      const [categoriesData, producersData, locationsData] = await Promise.all([
        getCategories().catch(err => {
          console.error('Error al cargar categorías:', err);
          setFilterErrors(prev => ({ ...prev, categories: 'Error al cargar categorías' }));
          return [];
        }),
        getProducers().catch(err => {
          console.error('Error al cargar productores:', err);
          setFilterErrors(prev => ({ ...prev, producers: 'Error al cargar productores' }));
          return [];
        }),
        getLocations().catch(err => {
          console.error('Error al cargar ubicaciones:', err);
          setFilterErrors(prev => ({ ...prev, locations: 'Error al cargar ubicaciones' }));
          return [];
        })
      ]);
      
      console.log('Datos de filtros cargados:', {
        categories: categoriesData,
        producers: producersData,
        locations: locationsData
      });
      
      setCategories(categoriesData || []);
      setProducers(producersData || []);
      setLocations(locationsData || []);
      
    } catch (error) {
      console.error('Error general al cargar datos de filtros:', error);
      setFilterErrors({ general: 'Error al cargar filtros' });
    } finally {
      setLoadingFilters(false);
    }
  };

  /**
   * Manejar cambios en los filtros
   */
  const handleFilterChange = (filterName, value) => {
    console.log(`Filtro cambiado: ${filterName} = ${value}`);
    onFilterChange({ [filterName]: value });
  };

  /**
   * Manejar cambio en el rango de precios
   */
  const handlePriceChange = (type, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    
    // Validar que el precio mínimo no sea mayor al máximo
    if (type === 'priceMin' && filters.priceMax && numValue > parseFloat(filters.priceMax)) {
      return;
    }
    if (type === 'priceMax' && filters.priceMin && numValue < parseFloat(filters.priceMin)) {
      return;
    }
    
    handleFilterChange(type, value);
  };

  /**
   * Verificar si hay filtros activos
   */
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="product-filter">
      <div className="filter-header">
        <h3>
          <i className="fas fa-filter"></i>
          Filtrar Productos
        </h3>
        {hasActiveFilters && (
          <button 
            className="clear-filters-btn"
            onClick={onClearFilters}
            disabled={isLoading}
            title="Limpiar todos los filtros"
          >
            <i className="fas fa-times"></i>
            Limpiar
          </button>
        )}
      </div>

      {/* Mostrar errores de carga si los hay */}
      {filterErrors.general && (
        <div className="filter-error">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{filterErrors.general}</span>
          <button onClick={loadFilterData} className="retry-btn">
            <i className="fas fa-redo"></i>
          </button>
        </div>
      )}

      {/* Filtro de búsqueda */}
      <div className="filter-group">
        <label htmlFor="search">
          <i className="fas fa-search"></i>
          Buscar productos
        </label>
        <input
          type="text"
          id="search"
          placeholder="Buscar por nombre o descripción..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          disabled={isLoading}
        />
        {filters.search && (
          <button 
            className="clear-input-btn"
            onClick={() => handleFilterChange('search', '')}
            title="Limpiar búsqueda"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Filtro por categoría */}
      <div className="filter-group">
        <label htmlFor="category">
          <i className="fas fa-tags"></i>
          Categoría
        </label>
        {loadingFilters ? (
          <div className="filter-loading">
            <i className="fas fa-spinner fa-spin"></i>
            Cargando...
          </div>
        ) : filterErrors.categories ? (
          <div className="filter-error-small">
            {filterErrors.categories}
            <button onClick={loadFilterData} className="retry-btn-small">
              <i className="fas fa-redo"></i>
            </button>
          </div>
        ) : (
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            disabled={isLoading}
          >
            <option key="all-categories" value="">
              Todas las categorías ({categories.length})
            </option>
            {categories.map(category => (
              <option 
                key={category._id || category.id || `category-${category.name}`} 
                value={category.name}
              >
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Filtro por productor */}
      <div className="filter-group">
        <label htmlFor="producer">
          <i className="fas fa-user"></i>
          Productor
        </label>
        {loadingFilters ? (
          <div className="filter-loading">
            <i className="fas fa-spinner fa-spin"></i>
            Cargando...
          </div>
        ) : filterErrors.producers ? (
          <div className="filter-error-small">
            {filterErrors.producers}
            <button onClick={loadFilterData} className="retry-btn-small">
              <i className="fas fa-redo"></i>
            </button>
          </div>
        ) : (
          <select
            id="producer"
            value={filters.producer}
            onChange={(e) => handleFilterChange('producer', e.target.value)}
            disabled={isLoading}
          >
            <option key="all-producers" value="">
              Todos los productores ({producers.length})
            </option>
            {producers.map(producer => (
              <option 
                key={producer._id || producer.id || `producer-${producer.name}`} 
                value={producer.name}
              >
                {producer.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Filtro por ubicación */}
      <div className="filter-group">
        <label htmlFor="location">
          <i className="fas fa-map-marker-alt"></i>
          Ubicación
        </label>
        {loadingFilters ? (
          <div className="filter-loading">
            <i className="fas fa-spinner fa-spin"></i>
            Cargando...
          </div>
        ) : filterErrors.locations ? (
          <div className="filter-error-small">
            {filterErrors.locations}
            <button onClick={loadFilterData} className="retry-btn-small">
              <i className="fas fa-redo"></i>
            </button>
          </div>
        ) : (
          <select
            id="location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            disabled={isLoading}
          >
            <option key="all-locations" value="">
              Todas las ubicaciones ({locations.length})
            </option>
            {locations.map(location => (
              <option 
                key={location._id || location.id || `location-${location.city}-${location.department}`} 
                value={`${location.city}, ${location.department}`}
              >
                {location.city}, {location.department}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Filtros de precio */}
      <div className="filter-group">
        <label>
          <i className="fas fa-dollar-sign"></i>
          Rango de precios
        </label>
        
        <div className="price-range">
          <div className="price-input">
            <label htmlFor="priceMin" className="price-label">Mínimo</label>
            <input
              type="number"
              id="priceMin"
              min="0"
              step="0.01"
              placeholder="$0.00"
              value={filters.priceMin}
              onChange={(e) => handlePriceChange('priceMin', e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="price-separator">-</div>
          
          <div className="price-input">
            <label htmlFor="priceMax" className="price-label">Máximo</label>
            <input
              type="number"
              id="priceMax"
              min="0"
              step="0.01"
              placeholder="$999.99"
              value={filters.priceMax}
              onChange={(e) => handlePriceChange('priceMax', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>
        
        {(filters.priceMin || filters.priceMax) && (
          <div className="price-display">
            Rango: ${filters.priceMin || '0'} - ${filters.priceMax || '∞'}
          </div>
        )}
      </div>

      {/* Filtros rápidos */}
      <div className="filter-group">
        <label>
          <i className="fas fa-bolt"></i>
          Filtros rápidos
        </label>
        <div className="quick-filters">
          <button 
            className={`quick-filter-btn ${filters.search === 'orgánico' ? 'active' : ''}`}
            onClick={() => handleFilterChange('search', filters.search === 'orgánico' ? '' : 'orgánico')}
            disabled={isLoading}
          >
            <i className="fas fa-leaf"></i>
            Orgánico
          </button>
          <button 
            className={`quick-filter-btn ${filters.search === 'fresco' ? 'active' : ''}`}
            onClick={() => handleFilterChange('search', filters.search === 'fresco' ? '' : 'fresco')}
            disabled={isLoading}
          >
            <i className="fas fa-seedling"></i>
            Fresco
          </button>
          <button 
            className={`quick-filter-btn ${filters.search === 'artesanal' ? 'active' : ''}`}
            onClick={() => handleFilterChange('search', filters.search === 'artesanal' ? '' : 'artesanal')}
            disabled={isLoading}
          >
            <i className="fas fa-hand-holding-heart"></i>
            Artesanal
          </button>
        </div>
      </div>

      {/* Información de filtros activos */}
      {hasActiveFilters && (
        <div className="active-filters-summary">
          <h4>Filtros activos:</h4>
          <div className="active-filters-list">
            {filters.search && (
              <span className="active-filter">
                Búsqueda: "{filters.search}"
                <button onClick={() => handleFilterChange('search', '')}>
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
            {filters.category && (
              <span className="active-filter">
                Categoría: {filters.category}
                <button onClick={() => handleFilterChange('category', '')}>
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
            {filters.producer && (
              <span className="active-filter">
                Productor: {filters.producer}
                <button onClick={() => handleFilterChange('producer', '')}>
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
            {filters.location && (
              <span className="active-filter">
                Ubicación: {filters.location}
                <button onClick={() => handleFilterChange('location', '')}>
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
            {(filters.priceMin || filters.priceMax) && (
              <span className="active-filter">
                Precio: ${filters.priceMin || '0'} - ${filters.priceMax || '∞'}
                <button onClick={() => {
                  handleFilterChange('priceMin', '');
                  handleFilterChange('priceMax', '');
                }}>
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
