// frontend/src/components/products/ProductCard.jsx
import React from 'react';
import { useCart } from '../../context/CartContext';

/**
 * Componente ProductCard - Tarjeta individual de producto
 * Muestra información del producto y permite agregarlo al carrito
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  /**
   * Obtener la imagen principal del producto o usar placeholder
   */
  const getProductImage = () => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return `http://localhost:3000${primaryImage.url}`;
    }
    return '/images/placeholder.jpg';
  };

  /**
   * Manejar error de carga de imagen
   */
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.jpg';
  };

  /**
   * Formatear precio
   */
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  /**
   * Truncar descripción si es muy larga
   */
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={getProductImage()} 
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="product-badges">
          {product.isOrganic && (
            <span className="badge organic-badge">
              <i className="fas fa-leaf"></i>
              Orgánico
            </span>
          )}
          {product.isFeatured && (
            <span className="badge featured-badge">
              <i className="fas fa-star"></i>
              Destacado
            </span>
          )}
        </div>

        {/* Stock badge */}
        {product.stock <= 10 && product.stock > 0 && (
          <span className="stock-badge low-stock">
            <i className="fas fa-exclamation-triangle"></i>
            Últimas {product.stock} unidades
          </span>
        )}
        
        {product.stock === 0 && (
          <span className="stock-badge out-of-stock">
            <i className="fas fa-times-circle"></i>
            Agotado
          </span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>
        
        <p className="product-description" title={product.description}>
          {truncateDescription(product.description)}
        </p>
        
        <div className="product-details">
          <div className="product-detail">
            <i className="fas fa-user-tie"></i>
            <span>{product.producer?.name || 'Productor desconocido'}</span>
          </div>
          
          <div className="product-detail">
            <i className="fas fa-tag"></i>
            <span>{product.category?.name || 'Sin categoría'}</span>
          </div>
          
          <div className="product-detail">
            <i className="fas fa-map-marker-alt"></i>
            <span>
              {product.producer?.location?.city 
                ? `${product.producer.location.city}, ${product.producer.location.department}`
                : 'Ubicación desconocida'
              }
            </span>
          </div>
        </div>

        {/* Tags del producto */}
        {product.tags && product.tags.length > 0 && (
          <div className="product-tags">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="product-tag">
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="product-tag more-tags">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        <div className="product-footer">
          <div className="price-section">
            <span className="product-price">
              {formatPrice(product.price)}
            </span>
            <span className="price-unit">
              por {product.unit}
            </span>
          </div>
          
          <button 
            className={`add-to-cart-btn ${product.stock === 0 ? 'disabled' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Producto agotado' : 'Agregar al carrito'}
          >
            {product.stock === 0 ? (
              <>
                <i className="fas fa-times-circle"></i>
                Agotado
              </>
            ) : (
              <>
                <i className="fas fa-cart-plus"></i>
                Agregar
              </>
            )}
          </button>
        </div>

        {/* Rating si existe */}
        {product.rating && product.rating.count > 0 && (
          <div className="product-rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map(star => (
                <i 
                  key={star}
                  className={`fas fa-star ${star <= Math.round(product.rating.average) ? 'filled' : ''}`}
                ></i>
              ))}
            </div>
            <span className="rating-text">
              {product.rating.average.toFixed(1)} ({product.rating.count} reseñas)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
