// frontend/src/components/admin/CategoryManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../services/api';

/**
 * Componente CategoryManager - Gestión completa de categorías
 * Permite crear, editar, eliminar y listar categorías
 */
const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'fas fa-tag'
  });

  // Lista de iconos disponibles
  const availableIcons = [
    { value: 'fas fa-apple-alt', label: 'Manzana (Frutas)' },
    { value: 'fas fa-carrot', label: 'Zanahoria (Verduras)' },
    { value: 'fas fa-cheese', label: 'Queso (Lácteos)' },
    { value: 'fas fa-seedling', label: 'Planta (Granos)' },
    { value: 'fas fa-candy-cane', label: 'Dulce (Endulzantes)' },
    { value: 'fas fa-fish', label: 'Pescado (Mariscos)' },
    { value: 'fas fa-drumstick-bite', label: 'Carne' },
    { value: 'fas fa-bread-slice', label: 'Pan (Panadería)' },
    { value: 'fas fa-wine-bottle', label: 'Botella (Bebidas)' },
    { value: 'fas fa-leaf', label: 'Hoja (Orgánico)' },
    { value: 'fas fa-tag', label: 'Etiqueta (General)' },
    { value: 'fas fa-star', label: 'Estrella (Destacado)' }
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Cargar categorías desde la API
   */
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Cargando categorías...');
      
      const data = await getCategories();
      console.log('Categorías cargadas:', data);
      
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      setError('Error al cargar las categorías. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validar formulario
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('El nombre de la categoría es requerido');
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      alert('El nombre debe tener al menos 2 caracteres');
      return false;
    }
    
    if (formData.name.trim().length > 50) {
      alert('El nombre no puede exceder 50 caracteres');
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
      
      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon
      };
      
      if (editingCategory) {
        console.log('Actualizando categoría:', editingCategory._id, categoryData);
        const updatedCategory = await updateCategory(editingCategory._id, categoryData);
        
        setCategories(prev => prev.map(c => 
          c._id === editingCategory._id ? updatedCategory : c
        ));
        
        alert('Categoría actualizada exitosamente');
      } else {
        console.log('Creando nueva categoría:', categoryData);
        const newCategory = await createCategory(categoryData);
        
        setCategories(prev => [...prev, newCategory]);
        alert('Categoría creada exitosamente');
      }

      resetForm();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      setError(error.message || 'Error al guardar la categoría. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar edición de categoría
   */
  const handleEdit = (category) => {
    console.log('Editando categoría:', category);
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || 'fas fa-tag'
    });
    setShowForm(true);
    setError(null);
  };

  /**
   * Manejar eliminación de categoría
   */
  const handleDelete = async (categoryId, categoryName) => {
    const confirmMessage = `¿Está seguro de que desea eliminar la categoría "${categoryName}"?\n\nEsta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Eliminando categoría:', categoryId);
      await deleteCategory(categoryId);
      
      setCategories(prev => prev.filter(c => c._id !== categoryId));
      alert('Categoría eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      setError(error.message || 'Error al eliminar la categoría. Puede que tenga productos asociados.');
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
      icon: 'fas fa-tag'
    });
    setEditingCategory(null);
    setShowForm(false);
    setError(null);
  };

  /**
   * Manejar recarga de datos
   */
  const handleReload = () => {
    loadCategories();
    resetForm();
  };

  if (isLoading && categories.length === 0) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="category-manager">
      <div className="manager-header">
        <h2>Gestión de Categorías</h2>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={handleReload}
            disabled={isLoading}
            title="Recargar datos"
          >
            <i className="fas fa-sync-alt"></i>
            Recargar
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
            disabled={isLoading}
          >
            <i className="fas fa-plus"></i>
            {showForm ? 'Cancelar' : 'Agregar Categoría'}
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

      {/* Formulario de categoría */}
      {showForm && (
        <div className="category-form-container">
          <h3>
            <i className={editingCategory ? 'fas fa-edit' : 'fas fa-plus'}></i>
            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
          </h3>
          
          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  Nombre de la Categoría *
                  <span className="char-count">({formData.name.length}/50)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Frutas, Verduras, Lácteos"
                  maxLength="50"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="icon">Icono de la Categoría</label>
                <select
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  {availableIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>
                      {icon.label}
                    </option>
                  ))}
                </select>
                <div className="icon-preview">
                  <i className={formData.icon}></i>
                  <span>Vista previa del icono</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">
                Descripción
                <span className="char-count">({formData.description.length}/200)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descripción opcional de la categoría"
                rows="3"
                maxLength="200"
                disabled={isLoading}
              />
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className="btn btn-primary"
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
                    {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
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

      {/* Tabla de categorías */}
      <div className="categories-table">
        <div className="table-header">
          <h3>
            Categorías Registradas 
            <span className="count-badge">{categories.length}</span>
          </h3>
        </div>

        {categories.length === 0 && !isLoading ? (
          <div className="no-data">
            <i className="fas fa-tags"></i>
            <h3>No hay categorías registradas</h3>
            <p>Crea la primera categoría para organizar tus productos</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="fas fa-plus"></i>
              Crear primera categoría
            </button>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Icono</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Productos</th>
                <th>Fecha de Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category._id}>
                  <td>
                    <div className="category-icon">
                      <i className={category.icon || 'fas fa-tag'}></i>
                    </div>
                  </td>
                  <td>
                    <div className="category-name">
                      <strong>{category.name}</strong>
                      {category.isActive === false && (
                        <span className="inactive-badge">Inactiva</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="category-description">
                      {category.description || (
                        <span className="no-description">Sin descripción</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="product-count">
                      {/* Aquí podrías agregar el conteo real de productos */}
                      <i className="fas fa-box"></i>
                      -
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      {category.createdAt ? (
                        new Date(category.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      ) : (
                        'No disponible'
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleEdit(category)}
                        disabled={isLoading}
                        title="Editar categoría"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(category._id, category.name)}
                        disabled={isLoading}
                        title="Eliminar categoría"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Información adicional */}
      <div className="manager-info">
        <div className="info-card">
          <i className="fas fa-info-circle"></i>
          <div>
            <h4>Información sobre Categorías</h4>
            <ul>
              <li>Las categorías ayudan a organizar tus productos</li>
              <li>Cada producto debe tener una categoría asignada</li>
              <li>No puedes eliminar categorías que tengan productos asociados</li>
              <li>Los iconos se muestran en el frontend para mejor experiencia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
