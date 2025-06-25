// frontend/src/components/admin/UserManager.jsx
import React, { useState, useEffect } from 'react';
import { 
  getUsers, 
  updateUser, 
  updateUserRole, 
  deleteUser 
} from '../../services/api';
import { useAuth } from '../../context/AuthContext';

/**
 * Componente UserManager - Gestión completa de usuarios (sin imágenes)
 * Permite editar, cambiar roles y eliminar usuarios (solo para admin)
 */
const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    search: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    isActive: true,
    address: {
      street: '',
      city: '',
      department: '',
      zipCode: ''
    }
  });

  const { user: currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  /**
   * Cargar usuarios desde la API
   */
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Cargando usuarios...');
      
      const data = await getUsers();
      console.log('Usuarios cargados:', data);
      
      setUsers(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar los usuarios. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Filtrar usuarios
   */
  const filteredUsers = users.filter(user => {
    const matchesRole = !filters.role || user.role === filters.role;
    const matchesSearch = !filters.search || 
      user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      user.email.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  /**
   * Manejar cambios en los inputs del formulario
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  /**
   * Manejar cambios en los filtros
   */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validar formulario
   */
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('El nombre es requerido');
      return false;
    }
    
    if (!formData.email.trim()) {
      alert('El email es requerido');
      return false;
    }
    
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      alert('El email debe tener un formato válido');
      return false;
    }
    
    return true;
  };

  /**
   * Manejar envío del formulario de edición
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        isActive: formData.isActive,
        address: formData.address
      };

      console.log('Actualizando usuario:', editingUser._id, userData);
      const updatedUser = await updateUser(editingUser._id, userData);
      
      setUsers(prev => prev.map(u => 
        u._id === editingUser._id ? updatedUser : u
      ));
      
      alert('Usuario actualizado exitosamente');
      resetForm();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setError(error.message || 'Error al actualizar el usuario. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar edición de usuario
   */
  const handleEdit = (user) => {
    console.log('Editando usuario:', user);
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      isActive: user.isActive !== false,
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        department: user.address?.department || '',
        zipCode: user.address?.zipCode || ''
      }
    });
    setShowEditForm(true);
    setError(null);
  };

  /**
   * Cambiar rol de usuario
   */
  const handleRoleChange = async (userId, newRole, userName) => {
    // Prevenir que el admin se quite sus propios privilegios
    if (userId === currentUser.id && newRole !== 'admin') {
      alert('No puedes cambiar tu propio rol de administrador');
      return;
    }

    const confirmMessage = `¿Está seguro de que desea cambiar el rol de "${userName}" a "${newRole}"?`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Cambiando rol de usuario:', userId, newRole);
      const updatedUser = await updateUserRole(userId, newRole);
      
      setUsers(prev => prev.map(u => 
        u._id === userId ? updatedUser : u
      ));
      
      alert('Rol de usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      setError(error.message || 'Error al cambiar el rol del usuario.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manejar eliminación de usuario
   */
  const handleDelete = async (userId, userName) => {
    // Prevenir que el admin se elimine a sí mismo
    if (userId === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta');
      return;
    }

    const confirmMessage = `¿Está seguro de que desea eliminar al usuario "${userName}"?\n\nEsta acción no se puede deshacer.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Eliminando usuario:', userId);
      await deleteUser(userId);
      
      setUsers(prev => prev.filter(u => u._id !== userId));
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setError(error.message || 'Error al eliminar el usuario.');
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
      role: 'user',
      isActive: true,
      address: {
        street: '',
        city: '',
        department: '',
        zipCode: ''
      }
    });
    setEditingUser(null);
    setShowEditForm(false);
    setError(null);
  };

  /**
   * Manejar recarga de datos
   */
  const handleReload = () => {
    loadUsers();
    resetForm();
  };

  /**
   * Limpiar filtros
   */
  const clearFilters = () => {
    setFilters({
      role: '',
      search: ''
    });
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="user-manager">
      <div className="manager-header">
        <h2>Gestión de Usuarios</h2>
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

      {/* Filtros */}
      <div className="filters-section">
        <h3>Filtros</h3>
        <div className="filters-row">
          <div className="filter-group">
            <label htmlFor="search">Buscar Usuario</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Buscar por nombre o email..."
              disabled={isLoading}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="role">Filtrar por Rol</label>
            <select
              id="role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              disabled={isLoading}
            >
              <option value="">Todos los roles</option>
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="filter-actions">
            <button 
              className="btn btn-secondary"
              onClick={clearFilters}
              disabled={isLoading}
            >
              <i className="fas fa-times"></i>
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Formulario de edición */}
      {showEditForm && (
        <div className="user-form-container">
          <h3>
            <i className="fas fa-edit"></i>
            Editar Usuario: {editingUser.name}
          </h3>
          
          <form onSubmit={handleSubmit} className="user-form">
            {/* Información básica */}
            <div className="form-section">
              <h4>Información Básica</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">
                    Nombre Completo *
                    <span className="char-count">({formData.name.length}/100)</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength="100"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+57 300 123 4567"
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    Usuario Activo
                  </label>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="form-section">
              <h4>Dirección</h4>
              
              <div className="form-group">
                <label htmlFor="address.street">Dirección</label>
                <input
                  type="text"
                  id="address.street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleInputChange}
                  placeholder="Calle, carrera, número"
                  disabled={isLoading}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="address.city">Ciudad</label>
                  <input
                    type="text"
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.department">Departamento</label>
                  <input
                    type="text"
                    id="address.department"
                    name="address.department"
                    value={formData.address.department}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address.zipCode">Código Postal</label>
                  <input
                    type="text"
                    id="address.zipCode"
                    name="address.zipCode"
                    value={formData.address.zipCode}
                    onChange={handleInputChange}
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
                    Actualizar Usuario
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

      {/* Tabla de usuarios */}
      <div className="users-table">
        <div className="table-header">
          <h3>
            Usuarios Registrados 
            <span className="count-badge">{filteredUsers.length}</span>
            {filters.role || filters.search ? (
              <span className="filter-indicator">
                (filtrado de {users.length} total)
              </span>
            ) : null}
          </h3>
        </div>

        {filteredUsers.length === 0 && !isLoading ? (
          <div className="no-data">
            <i className="fas fa-users"></i>
            <h3>No se encontraron usuarios</h3>
            <p>
              {filters.role || filters.search 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'No hay usuarios registrados en el sistema'
              }
            </p>
            {(filters.role || filters.search) && (
              <button 
                className="btn btn-primary"
                onClick={clearFilters}
              >
                <i className="fas fa-times"></i>
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info">
                        <div className="user-icon">
                          <i className="fas fa-user-circle"></i>
                        </div>
                        <div className="user-details">
                          <strong>{user.name}</strong>
                          {user._id === currentUser.id && (
                            <span className="current-user-badge">Tú</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="email-info">
                        <i className="fas fa-envelope"></i>
                        {user.email}
                      </div>
                    </td>
                    <td>
                      {user.phone ? (
                        <div className="phone-info">
                          <i className="fas fa-phone"></i>
                          {user.phone}
                        </div>
                      ) : (
                        <span className="no-data">No especificado</span>
                      )}
                    </td>
                    <td>
                      <div className="role-selector">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value, user.name)}
                          disabled={isLoading || user._id === currentUser.id}
                          className={`role-select ${user.role}`}
                        >
                          <option value="user">Usuario</option>
                          <option value="admin">Administrador</option>
                        </select>
                      </div>
                    </td>
                    <td>
                      <span className={`status ${user.isActive !== false ? 'active' : 'inactive'}`}>
                        {user.isActive !== false ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="date-info">
                        {user.createdAt ? (
                          new Date(user.createdAt).toLocaleDateString('es-ES', {
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
                          onClick={() => handleEdit(user)}
                          disabled={isLoading}
                          title="Editar usuario"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user._id, user.name)}
                          disabled={isLoading || user._id === currentUser.id}
                          title="Eliminar usuario"
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
            <h4>Información sobre Usuarios</h4>
            <ul>
              <li>Solo los administradores pueden gestionar usuarios</li>
              <li>No puedes eliminar tu propia cuenta de administrador</li>
              <li>No puedes cambiar tu propio rol de administrador</li>
              <li>Los usuarios inactivos no pueden iniciar sesión</li>
              <li>Los cambios de rol se aplican inmediatamente</li>
              <li>Los usuarios no tienen fotos de perfil en este sistema</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
