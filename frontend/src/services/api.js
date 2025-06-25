// frontend/src/services/api.js

// Configuración de URL base - detecta automáticamente el entorno
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // En Vercel, mismo dominio
  : 'http://localhost:3000/api';  // En desarrollo local

/**
 * Helper function para manejar peticiones API
 * @param {string} endpoint - Endpoint de la API
 * @param {object} options - Opciones de fetch
 * @returns {Promise<any>} - Datos de respuesta
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Headers por defecto
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

/**
 * Helper function para peticiones con FormData (archivos)
 */
async function apiRequestFormData(endpoint, formData, method = 'POST') {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error en la solicitud' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API FormData request error:', error);
    throw error;
  }
}

// ==================== PRODUCTOS ====================

/**
 * Obtener todos los productos
 */
export const getProducts = async () => {
  try {
    const response = await apiRequest('/products');
    return Array.isArray(response) ? response : response.products || response.data?.products || [];
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
};

/**
 * Obtener producto por ID
 */
export const getProductById = async (id) => {
  try {
    const response = await apiRequest(`/products/${id}`);
    return response.product || response.data?.product || response;
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

/**
 * Crear nuevo producto
 */
export const createProduct = async (productData) => {
  try {
    const formData = new FormData();
    
    // Agregar campos de texto
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && productData[key] !== undefined) {
        if (typeof productData[key] === 'object') {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });
    
    // Agregar imágenes si existen
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    const result = await apiRequestFormData('/products', formData, 'POST');
    return result.product || result.data?.product || result;
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
};

/**
 * Actualizar producto
 */
export const updateProduct = async (id, productData) => {
  try {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
      if (key !== 'images' && productData[key] !== undefined) {
        if (typeof productData[key] === 'object') {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });
    
    if (productData.images && productData.images.length > 0) {
      productData.images.forEach(image => {
        formData.append('images', image);
      });
    }
    
    const result = await apiRequestFormData(`/products/${id}`, formData, 'PUT');
    return result.product || result.data?.product || result;
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
};

/**
 * Eliminar producto
 */
export const deleteProduct = async (id) => {
  try {
    return await apiRequest(`/products/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

// ==================== CATEGORÍAS ====================

/**
 * Obtener todas las categorías
 */
export const getCategories = async () => {
  try {
    const response = await apiRequest('/categories');
    return Array.isArray(response) ? response : response.categories || response.data?.categories || [];
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return [];
  }
};

/**
 * Crear nueva categoría
 */
export const createCategory = async (categoryData) => {
  try {
    const result = await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
    return result.category || result.data?.category || result;
  } catch (error) {
    console.error('Error al crear categoría:', error);
    throw error;
  }
};

/**
 * Actualizar categoría
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const result = await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
    return result.category || result.data?.category || result;
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error;
  }
};

/**
 * Eliminar categoría
 */
export const deleteCategory = async (id) => {
  try {
    return await apiRequest(`/categories/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
};

// ==================== PRODUCTORES ====================

/**
 * Obtener todos los productores
 */
export const getProducers = async () => {
  try {
    const response = await apiRequest('/producers');
    return Array.isArray(response) ? response : response.producers || response.data?.producers || [];
  } catch (error) {
    console.error('Error al obtener productores:', error);
    return [];
  }
};

/**
 * Crear nuevo productor
 */
export const createProducer = async (producerData) => {
  try {
    const result = await apiRequest('/producers', {
      method: 'POST',
      body: JSON.stringify(producerData),
    });
    return result.producer || result.data?.producer || result;
  } catch (error) {
    console.error('Error al crear productor:', error);
    throw error;
  }
};

/**
 * Actualizar productor
 */
export const updateProducer = async (id, producerData) => {
  try {
    const result = await apiRequest(`/producers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producerData),
    });
    return result.producer || result.data?.producer || result;
  } catch (error) {
    console.error('Error al actualizar productor:', error);
    throw error;
  }
};

/**
 * Eliminar productor
 */
export const deleteProducer = async (id) => {
  try {
    return await apiRequest(`/producers/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error al eliminar productor:', error);
    throw error;
  }
};

// ==================== UBICACIONES ====================

/**
 * Obtener todas las ubicaciones
 */
export const getLocations = async () => {
  try {
    const response = await apiRequest('/locations');
    return Array.isArray(response) ? response : response.locations || response.data?.locations || [];
  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    return [];
  }
};

/**
 * Crear nueva ubicación
 */
export const createLocation = async (locationData) => {
  try {
    const result = await apiRequest('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    });
    return result.location || result.data?.location || result;
  } catch (error) {
    console.error('Error al crear ubicación:', error);
    throw error;
  }
};

/**
 * Actualizar ubicación
 */
export const updateLocation = async (id, locationData) => {
  try {
    const result = await apiRequest(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData),
    });
    return result.location || result.data?.location || result;
  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    throw error;
  }
};

/**
 * Eliminar ubicación
 */
export const deleteLocation = async (id) => {
  try {
    return await apiRequest(`/locations/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error al eliminar ubicación:', error);
    throw error;
  }
};

// ==================== USUARIOS ====================

/**
 * Obtener todos los usuarios (solo admin)
 */
export const getUsers = async () => {
  try {
    const response = await apiRequest('/users');
    return Array.isArray(response) ? response : response.users || response.data?.users || [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

/**
 * Actualizar usuario
 */
export const updateUser = async (id, userData) => {
  try {
    const result = await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return result.user || result.data?.user || result;
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    throw error;
  }
};

/**
 * Actualizar rol de usuario
 */
export const updateUserRole = async (id, role) => {
  try {
    const result = await apiRequest(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
    return result.user || result.data?.user || result;
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    throw error;
  }
};

/**
 * Eliminar usuario
 */
export const deleteUser = async (id) => {
  try {
    return await apiRequest(`/users/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

// ==================== AUTENTICACIÓN ====================

/**
 * Registrar usuario
 */
export const registerUser = async (userData) => {
  try {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return result;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

/**
 * Iniciar sesión
 */
export const loginUser = async (credentials) => {
  try {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return result;
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    throw error;
  }
};

// ==================== PEDIDOS ====================

/**
 * Obtener pedidos
 */
export const getOrders = async () => {
  try {
    const response = await apiRequest('/orders');
    return Array.isArray(response) ? response : response.orders || response.data?.orders || [];
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    return [];
  }
};

/**
 * Crear nuevo pedido
 */
export const createOrder = async (orderData) => {
  try {
    const result = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return result.order || result.data?.order || result;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

/**
 * Actualizar pedido
 */
export const updateOrder = async (id, orderData) => {
  try {
    const result = await apiRequest(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
    return result.order || result.data?.order || result;
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    throw error;
  }
};

/**
 * Eliminar pedido
 */
export const deleteOrder = async (id) => {
  try {
    return await apiRequest(`/orders/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    throw error;
  }
};

// ==================== UTILIDADES ====================

/**
 * Verificar estado de la API
 */
export const checkApiHealth = async () => {
  try {
    const response = await apiRequest('/health');
    return response;
  } catch (error) {
    console.error('Error al verificar estado de la API:', error);
    throw error;
  }
};

export default {
  // Productos
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  
  // Categorías
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Productores
  getProducers,
  createProducer,
  updateProducer,
  deleteProducer,
  
  // Ubicaciones
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  
  // Usuarios
  getUsers,
  updateUser,
  updateUserRole,
  deleteUser,
  
  // Autenticación
  registerUser,
  loginUser,
  
  // Pedidos
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
  
  // Utilidades
  checkApiHealth
};
