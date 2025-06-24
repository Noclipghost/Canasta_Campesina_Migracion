// frontend/src/components/admin/ProductManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories,
  getProducers 
} from '../../services/api';

/**
 * Componente ProductManager - Gestión completa de productos
 * Permite crear, editar, eliminar y listar productos con todas sus propiedades
 */
const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [producers, setProducers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    producer: '',
    stock: '',
    unit: 'kg',
    isOrganic: false,
    isFeatured: false,
    isAvailable: true,
    tags: '',
    harvestDate: '',
    expiryDate: ''
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Unidades disponibles
  const availableUnits = [
    { value: 'kg', label: 'Kilogramo (kg)' },
    { value: 'g', label: 'Gramo (g)' },
    { value: 'lb', label: 'Libra (lb)' },
    { value: 'unidad', label: 'Unidad' },
    { value: 'litro', label: 'Litro (L)' },
    { value: 'ml', label: 'Mililitro (ml)' },
    { value: 'docena', label: 'Docena' },
    { value: 'paquete', label: 'Paquete' }
  ];

  /**
   * Obtener URL completa de la imagen del producto
   */
  const getProductImageUrl = (product) => {
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

  // Usar useCallback para evitar recrear la función en cada render
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Cargando datos del administrador...');
      
      // Cargar datos secuencialmente para evitar sobrecarga
      const productsData = await getProducts();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const categoriesData = await getCategories();
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const producersData = await getProducers();
      
      console.log('Datos cargados:', {
        products: productsData.length,
        categories: categoriesData.length,
        producers: producersData.length
      });
      
      setProducts(productsData);
      setCategories(categoriesData);
      setProducers(producersData);
      setDataLoaded(true);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!dataLoaded) {
      loadData();
    }
  }, [loadData, dataLoaded]);

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  /**
   * Manejar cambio de imágenes
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Crear preview de imágenes
    const previews = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(previews).then(setImagePreview);
  };

  /**
   * Validar formulario
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('El nombre del producto es requerido');
      return false;
    }
    
    if (!formData.description.trim()) {
      alert('La descripción del producto es requerida');
      return false;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('El precio debe ser mayor a 0');
      return false;
    }
    
    if (!formData.category) {
      alert('Debe seleccionar una categoría');
      return false;
    }
    
    if (!formData.producer) {
      alert('Debe seleccionar un productor');
      return false;
    }
    
    if (!formData.stock || parseInt(formData.stock) < 0) {
      alert('El stock debe ser un número positivo');
      return false;
    }
    
    return true;
  };

  /**
   * Manejar envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: selectedImages
      };

      if (editingProduct) {
        console.log('Actualizando producto:', editingProduct._id, productData);
        const updatedProduct = await updateProduct(editingProduct._id, productData);
        
        setProducts(prev => prev.map(p => 
          p._id === editingProduct._id ? updatedProduct : p
        ));
        
        alert('Producto actualizado exitosamente');
      } else {
        console.log('Creando nuevo producto:', productData);
        const newProduct = await createProduct(productData);
        
        setProducts(prev => [...prev, newProduct]);
        alert('Producto creado exitosamente');
      }

      resetForm();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setError(error.message || 'Error al guardar el producto. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar edición de producto
   */
  const handleEdit = (product) => {
    console.log('Editando producto:', product);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category._id,
      producer: product.producer._id,
      stock: product.stock.toString(),
      unit: product.unit,
      isOrganic: product.isOrganic,
      isFeatured: product.isFeatured,
      isAvailable: product.isAvailable,
      tags: product.tags ? product.tags.join(', ') : '',
      harvestDate: product.harvestDate ? product.harvestDate.split('T')[0] : '',
      expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : ''
    });
    setSelectedImages([]);
    setImagePreview([]);
    setShowForm(true);
    setError(null);
  };

  /**
   * Manejar eliminación de producto
   */
  const handleDelete = async (productId, productName) => {
    const confirmMessage = `¿Está seguro de que desea eliminar el producto "${productName}"?\n\nEsta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Eliminando producto:', productId);
      await deleteProduct(productId);
      
      setProducts(prev => prev.filter(p => p._id !== productId));
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setError(error.message || 'Error al eliminar el producto. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resetear formulario
   */
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      producer: '',
      stock: '',
      unit: 'kg',
      isOrganic: false,
      isFeatured: false,
      isAvailable: true,
      tags: '',
      harvestDate: '',
      expiryDate: ''
    });
    setSelectedImages([]);
    setImagePreview([]);
    setEditingProduct(null);
    setShowForm(false);
    setError(null);
  };

  /**
   * Función de recarga con debounce
   */
  const handleReload = useCallback(() => {
    if (!isLoading) {
      setDataLoaded(false);
      loadData();
    }
  }, [isLoading, loadData]);

  if (isLoading && products.length === 0) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="product-manager">
      <div className="manager-header">
        <h2>Gestión de Productos</h2>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleReload}
            disabled={isLoading}
            title="Recargar datos"
          >
            <i className="fas fa-sync-alt"></i>
            {isLoading ? 'Cargando...' : 'Recargar'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            disabled={isLoading}
          >
            <i className="fas fa-plus"></i>
            {showForm ? 'Cancelar' : 'Agregar Producto'}
          </button>
        </div>
      </div>

      {/* Mostrar errores */}
      {error && (
        <div className="error-banner">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn btn-sm btn-secondary">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Formulario de producto */}
      {showForm && (
        <div className="product-form-container">
          <h3>
            <i className={editingProduct ? 'fas fa-edit' : 'fas fa-plus'}></i>
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          
          <form onSubmit={handleSubmit} className="product-form">
            {/* Información básica */}
            <div className="form-section">
              <h4>Información Básica</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Nombre del Producto *
                    <span className="char-count">({formData.name.length}/100)</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Manzanas Rojas Orgánicas"
                    maxLength="100"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Precio *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Descripción *
                  <span className="char-count">({formData.description.length}/1000)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descripción detallada del producto..."
                  rows="4"
                  maxLength="1000"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Clasificación */}
            <div className="form-section">
              <h4>Clasificación</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Categoría *</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="producer">Productor *</label>
                  <select
                    id="producer"
                    name="producer"
                    value={formData.producer}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar productor</option>
                    {producers.map(producer => (
                      <option key={producer._id} value={producer._id}>
                        {producer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Inventario */}
            <div className="form-section">
              <h4>Inventario</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="stock">Stock *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="0"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Unidad de Medida *</label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    {availableUnits.map(unit => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="form-section">
              <h4>Fechas (Opcional)</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="harvestDate">Fecha de Cosecha</label>
                  <input
                    type="date"
                    id="harvestDate"
                    name="harvestDate"
                    value={formData.harvestDate}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expiryDate">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Etiquetas */}
            <div className="form-section">
              <h4>Etiquetas y Características</h4>
              
              <div className="form-group">
                <label htmlFor="tags">
                  Etiquetas (separadas por comas)
                  <span className="help-text">Ej: orgánico, fresco, local, premium</span>
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="orgánico, fresco, local"
                  disabled={isLoading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isOrganic"
                      checked={formData.isOrganic}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    Producto Orgánico
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    Producto Destacado
                  </label>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    Disponible para Venta
                  </label>
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div className="form-section">
              <h4>Imágenes del Producto</h4>
              
              <div className="form-group">
                <label htmlFor="images">
                  Seleccionar Imágenes
                  <span className="help-text">Máximo 5 imágenes, formatos: JPG, PNG, WEBP</span>
                </label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </div>

              {/* Preview de imágenes */}
              {imagePreview.length > 0 && (
                <div className="image-preview">
                  <h5>Vista Previa:</h5>
                  <div className="preview-grid">
                    {imagePreview.map((src, index) => (
                      <div key={index} className="preview-item">
                        <img src={src} alt={`Preview ${index + 1}`} />
                        <span className="preview-label">Imagen {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Imágenes existentes en edición */}
              {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                <div className="existing-images">
                  <h5>Imágenes Actuales:</h5>
                  <div className="existing-grid">
                    {editingProduct.images.map((image, index) => (
                      <div key={index} className="existing-item">
                        <img 
                          src={`http://localhost:3000${image.url}`}
                          alt={image.alt || `Imagen ${index + 1}`}
                          onError={handleImageError}
                        />
                        <span className="existing-label">
                          {image.isPrimary && <i className="fas fa-star"></i>}
                          Imagen {index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones del formulario */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save"></i>
                    {editingProduct ? 'Actualizar' : 'Crear'} Producto
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-large"
                onClick={resetForm}
                disabled={isLoading}
              >
                <i className="fas fa-times"></i>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla de productos */}
      <div className="products-table">
        <div className="table-header">
          <h3>
            Productos Registrados 
            <span className="count-badge">{products.length}</span>
          </h3>
        </div>

        {products.length === 0 && !isLoading ? (
          <div className="no-data">
            <i className="fas fa-box-open"></i>
            <h3>No hay productos registrados</h3>
            <p>Crea el primer producto para comenzar a vender</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="fas fa-plus"></i>
              Crear primer producto
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Productor</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td>
                      <img 
                        src={getProductImageUrl(product)}
                        alt={product.name}
                        className="product-thumbnail"
                        onError={handleImageError}
                        loading="lazy"
                      />
                    </td>
                    <td>
                      <div className="product-info">
                        <div className="product-name">
                          <strong>{product.name}</strong>
                          <div className="product-badges">
                            {product.isOrganic && (
                              <span className="badge organic">Orgánico</span>
                            )}
                            {product.isFeatured && (
                              <span className="badge featured">Destacado</span>
                            )}
                          </div>
                        </div>
                        <div className="product-description">
                          {product.description.length > 50 
                            ? `${product.description.substring(0, 50)}...`
                            : product.description
                          }
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="price-info">
                        <strong>${product.price.toFixed(2)}</strong>
                        <small>por {product.unit}</small>
                      </div>
                    </td>
                    <td>{product.category?.name || 'Sin categoría'}</td>
                    <td>{product.producer?.name || 'Sin productor'}</td>
                    <td>
                      <span className={`stock ${product.stock <= 10 ? 'low' : ''}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td>
                      <span className={`status ${product.isAvailable ? 'available' : 'unavailable'}`}>
                        {product.isAvailable ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(product)}
                          disabled={isLoading}
                          title="Editar producto"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(product._id, product.name)}
                          disabled={isLoading}
                          title="Eliminar producto"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="manager-info">
        <div className="info-card">
          <i className="fas fa-info-circle"></i>
          <div>
            <h4>Información sobre Productos</h4>
            <ul>
              <li>Todos los campos marcados con * son obligatorios</li>
              <li>Las imágenes se redimensionan automáticamente</li>
              <li>Los productos orgánicos aparecen con una etiqueta especial</li>
              <li>Los productos destacados se muestran en la página principal</li>
              <li>El stock bajo (≤10) se marca en rojo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
