// frontend/src/components/admin/ProducerManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  getProducers, 
  createProducer, 
  updateProducer, 
  deleteProducer,
  getLocations 
} from '../../services/api';

/**
 * Componente ProducerManager - Gestión completa de productores
 * Permite crear, editar, eliminar y listar productores (sin imágenes)
 */
const ProducerManager = () => {
  const [producers, setProducers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProducer, setEditingProducer] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    farmSize: '',
    farmingMethods: []
  });

  // Métodos de cultivo disponibles
  const availableFarmingMethods = [
    { value: 'orgánico', label: 'Orgánico' },
    { value: 'tradicional', label: 'Tradicional' },
    { value: 'hidropónico', label: 'Hidropónico' },
    { value: 'agroecológico', label: 'Agroecológico' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Cargar todos los datos necesarios
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Cargando datos de productores...');
      
      const [producersData, locationsData] = await Promise.all([
        getProducers(),
        getLocations()
      ]);
      
      console.log('Datos cargados:', {
        producers: producersData.length,
        locations: locationsData.length
      });
      
      setProducers(producersData);
      setLocations(locationsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'farmingMethods') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          farmingMethods: [...prev.farmingMethods, value]
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          farmingMethods: prev.farmingMethods.filter(method => method !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  /**
   * Validar formulario
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('El nombre del productor es requerido');
      return false;
    }
    
    if (formData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      alert('El email debe tener un formato válido');
      return false;
    }
    
    if (!formData.phone.trim()) {
      alert('El teléfono es requerido');
      return false;
    }
    
    if (!formData.location) {
      alert('Debe seleccionar una ubicación');
      return false;
    }
    
    if (formData.farmSize && parseFloat(formData.farmSize) < 0) {
      alert('El tamaño de la finca debe ser un número positivo');
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
      
      const producerData = {
        ...formData,
        farmSize: formData.farmSize ? parseFloat(formData.farmSize) : undefined
      };

      if (editingProducer) {
        console.log('Actualizando productor:', editingProducer._id, producerData);
        const updatedProducer = await updateProducer(editingProducer._id, producerData);
        
        setProducers(prev => prev.map(p => 
          p._id === editingProducer._id ? updatedProducer : p
        ));
        
        alert('Productor actualizado exitosamente');
      } else {
        console.log('Creando nuevo productor:', producerData);
        const newProducer = await createProducer(producerData);
        
        setProducers(prev => [...prev, newProducer]);
        alert('Productor creado exitosamente');
      }

      resetForm();
    } catch (error) {
      console.error('Error al guardar productor:', error);
      setError(error.message || 'Error al guardar el productor. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar edición de productor
   */
  const handleEdit = (producer) => {
    console.log('Editando productor:', producer);
    setEditingProducer(producer);
    setFormData({
      name: producer.name,
      email: producer.email || '',
      phone: producer.phone,
      location: producer.location._id,
      description: producer.description || '',
      farmSize: producer.farmSize ? producer.farmSize.toString() : '',
      farmingMethods: producer.farmingMethods || []
    });
    setShowForm(true);
    setError(null);
  };

  /**
   * Manejar eliminación de productor
   */
  const handleDelete = async (producerId, producerName) => {
    const confirmMessage = `¿Está seguro de que desea eliminar el productor "${producerName}"?\n\nEsta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Eliminando productor:', producerId);
      await deleteProducer(producerId);
      
      setProducers(prev => prev.filter(p => p._id !== producerId));
      alert('Productor eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar productor:', error);
      setError(error.message || 'Error al eliminar el productor. Puede que tenga productos asociados.');
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
      email: '',
      phone: '',
      location: '',
      description: '',
      farmSize: '',
      farmingMethods: []
    });
    setEditingProducer(null);
    setShowForm(false);
    setError(null);
  };

  /**
   * Manejar recarga de datos
   */
  const handleReload = () => {
    loadData();
    resetForm();
  };

  if (isLoading && producers.length === 0) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando productores...</p>
      </div>
    );
  }

  return (
    <div className="producer-manager">
      <div className="manager-header">
        <h2>Gestión de Productores</h2>
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
            {showForm ? 'Cancelar' : 'Agregar Productor'}
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

      {/* Formulario de productor */}
      {showForm && (
        <div className="producer-form-container">
          <h3>
            <i className={editingProducer ? 'fas fa-edit' : 'fas fa-plus'}></i>
            {editingProducer ? 'Editar Productor' : 'Nuevo Productor'}
          </h3>
          
          <form onSubmit={handleSubmit} className="producer-form">
            {/* Información básica */}
            <div className="form-section">
              <h4>Información Básica</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Nombre del Productor *
                    <span className="char-count">({formData.name.length}/100)</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Finca Los Manzanos"
                    maxLength="100"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+57 300 123 4567"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contacto@finca.com"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Ubicación *</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar ubicación</option>
                    {locations.map(location => (
                      <option key={location._id} value={location._id}>
                        {location.city}, {location.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Descripción
                  <span className="char-count">({formData.description.length}/500)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Descripción del productor y sus métodos de cultivo..."
                  rows="3"
                  maxLength="500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Información de la finca */}
            <div className="form-section">
              <h4>Información de la Finca</h4>
              
              <div className="form-group">
                <label htmlFor="farmSize">Tamaño de la Finca (hectáreas)</label>
                <input
                  type="number"
                  id="farmSize"
                  name="farmSize"
                  value={formData.farmSize}
                  onChange={handleInputChange}
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Métodos de Cultivo</label>
                <div className="checkbox-group">
                  {availableFarmingMethods.map(method => (
                    <label key={method.value} className="checkbox-label">
                      <input
                        type="checkbox"
                        name="farmingMethods"
                        value={method.value}
                        checked={formData.farmingMethods.includes(method.value)}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                      <span className="checkmark"></span>
                      {method.label}
                    </label>
                  ))}
                </div>
              </div>
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
                    {editingProducer ? 'Actualizar' : 'Crear'} Productor
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

      {/* Tabla de productores */}
      <div className="producers-table">
        <div className="table-header">
          <h3>
            Productores Registrados 
            <span className="count-badge">{producers.length}</span>
          </h3>
        </div>

        {producers.length === 0 && !isLoading ? (
          <div className="no-data">
            <i className="fas fa-users"></i>
            <h3>No hay productores registrados</h3>
            <p>Registra el primer productor para comenzar</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="fas fa-plus"></i>
              Registrar primer productor
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Ubicación</th>
                  <th>Finca</th>
                  <th>Métodos</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {producers.map(producer => (
                  <tr key={producer._id}>
                    <td>
                      <div className="producer-info">
                        <div className="producer-name">
                          <i className="fas fa-user-tie"></i>
                          <strong>{producer.name}</strong>
                        </div>
                        <div className="producer-description">
                          {producer.description ? (
                            producer.description.length > 50 
                              ? `${producer.description.substring(0, 50)}...`
                              : producer.description
                          ) : (
                            <span className="no-description">Sin descripción</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div><i className="fas fa-phone"></i> {producer.phone}</div>
                        {producer.email && (
                          <div><i className="fas fa-envelope"></i> {producer.email}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <i className="fas fa-map-marker-alt"></i>
                        {producer.location?.city}, {producer.location?.department}
                      </div>
                    </td>
                    <td>
                      <div className="farm-info">
                        {producer.farmSize ? (
                          <div><i className="fas fa-ruler-combined"></i> {producer.farmSize} ha</div>
                        ) : (
                          <span className="no-data">No especificado</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="farming-methods">
                        {producer.farmingMethods && producer.farmingMethods.length > 0 ? (
                          producer.farmingMethods.map(method => (
                            <span key={method} className="method-badge">
                              {method}
                            </span>
                          ))
                        ) : (
                          <span className="no-data">No especificado</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`status ${producer.isActive !== false ? 'active' : 'inactive'}`}>
                        {producer.isActive !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(producer)}
                          disabled={isLoading}
                          title="Editar productor"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(producer._id, producer.name)}
                          disabled={isLoading}
                          title="Eliminar productor"
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
            <h4>Información sobre Productores</h4>
            <ul>
              <li>Los productores deben tener una ubicación asignada</li>
              <li>El teléfono es obligatorio para contacto directo</li>
              <li>Los métodos de cultivo ayudan a categorizar los productos</li>
              <li>El tamaño de la finca es opcional pero útil para estadísticas</li>
              <li>No puedes eliminar productores que tengan productos asociados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerManager;
