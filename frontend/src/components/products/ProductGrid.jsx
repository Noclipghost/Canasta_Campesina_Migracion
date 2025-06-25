// frontend/src/components/products/ProductGrid.jsx - Asegurar keys únicas
import React from 'react';
import ProductCard from './ProductCard';

/**
 * Componente ProductGrid - Grid responsive de productos
 * Muestra los productos en formato de cuadrícula
 */
const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <i className="fas fa-search"></i>
        <h3>No se encontraron productos</h3>
        <p>Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard 
          key={product._id || product.id || `product-${product.name}-${Math.random()}`} 
          product={product} 
        />
      ))}
    </div>
  );
};

export default ProductGrid;
