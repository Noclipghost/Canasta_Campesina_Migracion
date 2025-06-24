// frontend/src/components/admin/LocationManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  getLocations, 
  createLocation, 
  updateLocation, 
  deleteLocation 
} from '../../services/api';

/**
 * Componente LocationManager - Gestión completa de ubicaciones
 * Permite crear, editar, eliminar y listar ubicaciones
 */
const LocationManager = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    city: '',
    department: '',
    country: 'Colombia',
    coordinates: {
      latitude: '',
      longitude: ''
    }
  });

  // Departamentos de Colombia
  const colombianDepartments = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
    'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
    'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
    'Vaupés', 'Vichada'
  ];

  useEffect(() => {
    loadLocations();
  }, []);

  /**
   * Cargar ubicaciones desde la API
   */
  const loadLocations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Cargando ubicaciones...');
      
      const data = await getLocations();
      console.log('Ubicaciones cargadas:', data);
      
      setLocations(data);
    } catch (error) {
      console.error('Error al cargar ubicaciones:', error);
      setError('Error al cargar las ubicaciones. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'latitude' || name === 'longitude') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  /**
   * Validar formulario
   */
  const validateForm = () => {
    if (!formData.city.trim()) {
      alert('La ciudad es requerida');
      return false;
    }
    
    if (!formData.department.trim()) {
      alert('El departamento es requerido');
      return false;
    }
    
    if (formData.coordinates.latitude && (
      isNaN(formData.coordinates.latitude) || 
      formData.coordinates.latitude < -90 || 
      formData.coordinates.latitude > 90
    )) {
      alert('La latitud debe ser un número entre -90 y 90');
      return false;
    }
    
    if (formData.coordinates.longitude && (
      isNaN(formData.coordinates.longitude) || 
      formData.coordinates.longitude < -180 || 
      formData.coordinates.longitude > 180
    )) {
      alert('La longitud debe ser un número entre -180 y 180');
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
      
      const locationData = {
        city: formData.city.trim(),
        department: formData.department.trim(),
        country: formData.country.trim(),
        coordinates: {
          latitude: formData.coordinates.latitude ? parseFloat(formData.coordinates.latitude) : undefined,
          longitude: formData.coordinates.longitude ? parseFloat(formData.coordinates.longitude) : undefined
        }
      };

      // Remover coordenadas vacías
      if (!locationData.coordinates.latitude && !locationData.coordinates.longitude) {
        delete locationData.coordinates;
      }

      if (editingLocation) {
        console.log('Actualizando ubicación:', editingLocation._id, locationData);
        const updatedLocation = await updateLocation(editingLocation._id, locationData);
        
        setLocations(prev => prev.map(l => 
          l._id === editingLocation._id ? updatedLocation : l
        ));
        
        alert('Ubicación actualizada exitosamente');
      } else {
        console.log('Creando nueva ubicación:', locationData);
        const newLocation = await createLocation(locationData);
        
        setLocations(prev => [...prev, newLocation]);
        alert('Ubicación creada exitosamente');
      }

      resetForm();
    } catch (error) {
      console.error('Error al guardar ubicación:', error);
      setError(error.message || 'Error al guardar la ubicación. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar edición de ubicación
   */
  const handleEdit = (location) => {
    console.log('Editando ubicación:', location);
    setEditingLocation(location);
    setFormData({
      city: location.city,
      department: location.department,
      country: location.country || 'Colombia',
      coordinates: {
        latitude: location.coordinates?.latitude?.toString() || '',
        longitude: location.coordinates?.longitude?.toString() || ''
      }
    });
    setShowForm(true);
    setError(null);
  };

  /**
   * Manejar eliminación de ubicación
   */
  const handleDelete = async (locationId, locationName) => {
    const confirmMessage = `¿Está seguro de que desea eliminar la ubicación "${locationName}"?\n\nEsta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Eliminando ubicación:', locationId);
      await deleteLocation(locationId);
      
      setLocations(prev => prev.filter(l => l._id !== locationId));
      alert('Ubicación eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar ubicación:', error);
      setError(error.message || 'Error al eliminar la ubicación. Puede que tenga productores asociados.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resetear formulario
   */
  const resetForm = () => {
    setFormData({
      city: '',
      department: '',
      country: 'Colombia',
      coordinates: {
        latitude: '',
        longitude: ''
      }
    });
    setEditingLocation(null);
    setShowForm(false);
    setError(null);
  };

  /**
   * Manejar recarga de datos
   */
  const handleReload = () => {
    loadLocations();
    resetForm();
  };

  if (isLoading && locations.length === 0) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando ubicaciones...</p>
      </div>
    );
  }

  return (
    <div className="location-manager">
      <div className="manager-header">
        <h2>Gestión de Ubicaciones</h2>
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
            {showForm ? 'Cancelar' : 'Agregar Ubicación'}
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

      {/* Formulario de ubicación */}
      {showForm && (
        <div className="location-form-container">
          <h3>
            <i className={editingLocation ? 'fas fa-edit' : 'fas fa-plus'}></i>
            {editingLocation ? 'Editar Ubicación' : 'Nueva Ubicación'}
          </h3>
          
          <form onSubmit={handleSubmit} className="location-form">
            {/* Información básica */}
            <div className="form-section">
              <h4>Información Básica</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">
                    Ciudad *
                    <span className="char-count">({formData.city.length}/100)</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ej: Bogotá, Medellín, Cali"
                    maxLength="100"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="department">Departamento *</label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  >
                    <option value="">Seleccionar departamento</option>
                    {colombianDepartments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country">País</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Colombia"
                  maxLength="100"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Coordenadas geográficas */}
            <div className="form-section">
              <h4>Coordenadas Geográficas (Opcional)</h4>
              <p className="help-text">
                Las coordenadas ayudan a mostrar la ubicación exacta en mapas
              </p>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="latitude">
                    Latitud
                    <span className="help-text">(-90 a 90)</span>
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    name="latitude"
                    value={formData.coordinates.latitude}
                    onChange={handleInputChange}
                    placeholder="4.7110"
                    step="any"
                    min="-90"
                    max="90"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="longitude">
                    Longitud
                    <span className="help-text">(-180 a 180)</span>
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    name="longitude"
                    value={formData.coordinates.longitude}
                    onChange={handleInputChange}
                    placeholder="-74.0721"
                    step="any"
                    min="-180"
                    max="180"
                    disabled={isLoading}
                  />
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
                    {editingLocation ? 'Actualizar' : 'Crear'} Ubicación
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

      {/* Tabla de ubicaciones */}
      <div className="locations-table">
        <div className="table-header">
          <h3>
            Ubicaciones Registradas 
            <span className="count-badge">{locations.length}</span>
          </h3>
        </div>

        {locations.length === 0 && !isLoading ? (
          <div className="no-data">
            <i className="fas fa-map-marker-alt"></i>
            <h3>No hay ubicaciones registradas</h3>
            <p>Registra la primera ubicación para asignar a productores</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="fas fa-plus"></i>
              Registrar primera ubicación
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Ciudad</th>
                  <th>Departamento</th>
                  <th>País</th>
                  <th>Coordenadas</th>
                  <th>Productores</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {locations.map(location => (
                  <tr key={location._id}>
                    <td>
                      <div className="location-name">
                        <i className="fas fa-city"></i>
                        <strong>{location.city}</strong>
                      </div>
                    </td>
                    <td>
                      <div className="department-name">
                        <i className="fas fa-map"></i>
                        {location.department}
                      </div>
                    </td>
                    <td>{location.country || 'Colombia'}</td>
                    <td>
                      {location.coordinates?.latitude && location.coordinates?.longitude ? (
                        <div className="coordinates">
                          <div>
                            <i className="fas fa-crosshairs"></i>
                            {location.coordinates.latitude.toFixed(4)}, {location.coordinates.longitude.toFixed(4)}
                          </div>
                          <a 
                            href={`https://www.google.com/maps?q=${location.coordinates.latitude},${location.coordinates.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="map-link"
                            title="Ver en Google Maps"
                          >
                            <i className="fas fa-external-link-alt"></i>
                            Ver en mapa
                          </a>
                        </div>
                      ) : (
                        <span className="no-coordinates">No especificadas</span>
                      )}
                    </td>
                    <td>
                      <span className="producer-count">
                        <i className="fas fa-users"></i>
                        {/* Aquí podrías agregar el conteo real de productores */}
                        -
                      </span>
                    </td>
                    <td>
                      <div className="date-info">
                        {location.createdAt ? (
                          new Date(location.createdAt).toLocaleDateString('es-ES', {
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
                          onClick={() => handleEdit(location)}
                          disabled={isLoading}
                          title="Editar ubicación"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(location._id, `${location.city}, ${location.department}`)}
                          disabled={isLoading}
                          title="Eliminar ubicación"
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
            <h4>Información sobre Ubicaciones</h4>
            <ul>
              <li>Las ubicaciones se asignan a productores para identificar el origen de los productos</li>
              <li>Las coordenadas geográficas son opcionales pero útiles para mapas</li>
              <li>No puedes eliminar ubicaciones que tengan productores asociados</li>
              <li>Puedes buscar coordenadas en Google Maps y copiarlas aquí</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationManager;
