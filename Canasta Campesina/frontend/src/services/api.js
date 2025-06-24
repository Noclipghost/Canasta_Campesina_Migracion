// frontend/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Función helper para realizar peticiones HTTP con autenticación
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Obtener token de autenticación
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Si la respuesta tiene estructura {success: true, data: {...}}
    if (data.success && data.data) {
      return data.data;
    }
    
    // Si la respuesta es directamente un array o objeto
    return data;
    
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * Función helper para peticiones con FormData (archivos)
 */
const apiRequestFormData = async (endpoint, formData, method = 'POST') => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(url, {
      method,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || data;
    
  } catch (error) {
    console.error('API FormData Request Error:', error);
    throw error;
  }
};

// ========== PRODUCTOS ==========

/**
 * Obtener todos los productos
 */
export const getProducts = async () => {
  try {
    const products = await apiRequest('/products');
    console.log('Productos obtenidos del backend:', products);
    return Array.isArray(products) ? products : products.products || [];
  } catch (error) {
    console.error('Error al obtener productos del backend:', error);
    return getMockProducts();
  }
};

/**
 * Obtener producto por ID
 */
export const getProductById = async (id) => {
  try {
    const product = await apiRequest(`/products/${id}`);
    return product.product || product;
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
    
    // Agregar campos del producto
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        if (Array.isArray(productData[key])) {
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
    
    const response = await apiRequestFormData('/products', formData, 'POST');
    return response.product || response;
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
      if (key !== 'images') {
        if (Array.isArray(productData[key])) {
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
    
    const response = await apiRequestFormData(`/products/${id}`, formData, 'PUT');
    return response.product || response;
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
    await apiRequest(`/products/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
};

/**
 * Filtrar productos
 */
export const filterProducts = async (filters) => {
  try {
    const params = new URLSearchParams();
    
    console.log('Filtros enviados desde frontend:', filters);
    
    if (filters.category && filters.category !== '') {
      params.append('category', filters.category);
    }
    if (filters.producer && filters.producer !== '') {
      params.append('producer', filters.producer);
    }
    if (filters.location && filters.location !== '') {
      params.append('location', filters.location);
    }
    if (filters.priceMin && filters.priceMin !== '') {
      params.append('priceMin', filters.priceMin);
    }
    if (filters.priceMax && filters.priceMax !== '') {
      params.append('priceMax', filters.priceMax);
    }
    if (filters.search && filters.search !== '') {
      params.append('search', filters.search);
    }

    const url = `/products?${params.toString()}`;
    console.log('URL de filtrado:', `${API_BASE_URL}${url}`);
    
    const products = await apiRequest(url);
    console.log('Productos filtrados recibidos:', products);
    
    return Array.isArray(products) ? products : products.products || [];
  } catch (error) {
    console.error('Error al filtrar productos del backend:', error);
    return [];
  }
};

// ========== CATEGORÍAS ==========

/**
 * Obtener todas las categorías
 */
export const getCategories = async () => {
  try {
    const categories = await apiRequest('/categories');
    console.log('Categorías obtenidas del backend:', categories);
    return Array.isArray(categories) ? categories : categories.categories || [];
  } catch (error) {
    console.error('Error al obtener categorías del backend:', error);
    return getMockCategories();
  }
};

/**
 * Obtener categoría por ID
 */
export const getCategoryById = async (id) => {
  try {
    const category = await apiRequest(`/categories/${id}`);
    return category.category || category;
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    throw error;
  }
};

/**
 * Crear nueva categoría
 */
export const createCategory = async (categoryData) => {
  try {
    const category = await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
    return category.category || category;
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
    const category = await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData)
    });
    return category.category || category;
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
    await apiRequest(`/categories/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
};

// ========== PRODUCTORES ==========

/**
 * Obtener todos los productores
 */
export const getProducers = async () => {
  try {
    const producers = await apiRequest('/producers');
    console.log('Productores obtenidos del backend:', producers);
    return Array.isArray(producers) ? producers : producers.producers || [];
  } catch (error) {
    console.error('Error al obtener productores del backend:', error);
    return getMockProducers();
  }
};

/**
 * Obtener productor por ID
 */
export const getProducerById = async (id) => {
  try {
    const producer = await apiRequest(`/producers/${id}`);
    return producer.producer || producer;
  } catch (error) {
    console.error('Error al obtener productor:', error);
    throw error;
  }
};

/**
 * Crear nuevo productor
 */
export const createProducer = async (producerData) => {
  try {
    const formData = new FormData();
    
    Object.keys(producerData).forEach(key => {
      if (key !== 'avatar') {
        if (Array.isArray(producerData[key])) {
          formData.append(key, JSON.stringify(producerData[key]));
        } else {
          formData.append(key, producerData[key]);
        }
      }
    });
    
    if (producerData.avatar) {
      formData.append('avatar', producerData.avatar);
    }
    
    const response = await apiRequestFormData('/producers', formData, 'POST');
    return response.producer || response;
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
    const formData = new FormData();
    
    Object.keys(producerData).forEach(key => {
      if (key !== 'avatar') {
        if (Array.isArray(producerData[key])) {
          formData.append(key, JSON.stringify(producerData[key]));
        } else {
          formData.append(key, producerData[key]);
        }
      }
    });
    
    if (producerData.avatar) {
      formData.append('avatar', producerData.avatar);
    }
    
    const response = await apiRequestFormData(`/producers/${id}`, formData, 'PUT');
    return response.producer || response;
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
    await apiRequest(`/producers/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Error al eliminar productor:', error);
    throw error;
  }
};

// ========== UBICACIONES ==========

/**
 * Obtener todas las ubicaciones
 */
export const getLocations = async () => {
  try {
    const locations = await apiRequest('/locations');
    console.log('Ubicaciones obtenidas del backend:', locations);
    return Array.isArray(locations) ? locations : locations.locations || [];
  } catch (error) {
    console.error('Error al obtener ubicaciones del backend:', error);
    return getMockLocations();
  }
};

/**
 * Obtener ubicación por ID
 */
export const getLocationById = async (id) => {
  try {
    const location = await apiRequest(`/locations/${id}`);
    return location.location || location;
  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    throw error;
  }
};

/**
 * Crear nueva ubicación
 */
export const createLocation = async (locationData) => {
  try {
    const location = await apiRequest('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData)
    });
    return location.location || location;
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
    const location = await apiRequest(`/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData)
    });
    return location.location || location;
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
    await apiRequest(`/locations/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Error al eliminar ubicación:', error);
    throw error;
  }
};

// ========== USUARIOS ==========

/**
 * Obtener todos los usuarios
 */
export const getUsers = async () => {
  try {
    const users = await apiRequest('/users');
    return Array.isArray(users) ? users : users.users || [];
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

/**
 * Obtener usuario por ID
 */
export const getUserById = async (id) => {
  try {
    const user = await apiRequest(`/users/${id}`);
    return user.user || user;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    throw error;
  }
};

/**
 * Actualizar usuario
 */
export const updateUser = async (id, userData) => {
  try {
    const user = await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return user.user || user;
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
    const user = await apiRequest(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
    return user.user || user;
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    throw error;
  }
};
/**
 * Eliminar usuario
 */
export const deleteUser = async (id) => {
  try {
    await apiRequest(`/users/${id}`, { method: 'DELETE' });
    return true;
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw error;
  }
};

// ========== AUTENTICACIÓN ==========

/**
 * Autenticar usuario
 */
export const loginUser = async (credentials) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    console.log('Login response del backend:', response);
    
    if (response.success || response.user) {
      return {
        success: true,
        user: response.user || response.data.user,
        token: response.token || response.data.token
      };
    }
    
    throw new Error(response.message || 'Error en el login');
    
  } catch (error) {
    console.error('Error en login del backend:', error);
    
    // Fallback a simulación para desarrollo
    if (credentials.email === 'admin@canasta.com' && credentials.password === 'admin123') {
      return {
        success: true,
        user: {
          id: 1,
          name: 'Administrador',
          email: 'admin@canasta.com',
          role: 'admin'
        }
      };
    } else if (credentials.email === 'usuario@canasta.com' && credentials.password === 'user123') {
      return {
        success: true,
        user: {
          id: 2,
          name: 'Usuario Demo',
          email: 'usuario@canasta.com',
          role: 'user'
        }
      };
    } else {
      throw new Error('Credenciales incorrectas');
    }
  }
};

/**
 * Registrar nuevo usuario
 */
export const registerUser = async (userData) => {
  try {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    return {
      success: true,
      user: response.user || response.data.user,
      token: response.token || response.data.token
    };
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

// ========== PEDIDOS ==========

/**
 * Obtener pedidos
 */
export const getOrders = async () => {
  try {
    const orders = await apiRequest('/orders');
    return Array.isArray(orders) ? orders : orders.orders || [];
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    throw error;
  }
};

/**
 * Crear nuevo pedido
 */
export const createOrder = async (orderData) => {
  try {
    const order = await apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
    return order.order || order;
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
};

/**
 * Actualizar estado del pedido
 */
export const updateOrderStatus = async (id, status) => {
  try {
    const order = await apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return order.order || order;
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    throw error;
  }
};

// ========== DATOS MOCK PARA FALLBACK ==========

const getMockProducts = () => {
  return [
    {
      _id: '1',
      name: 'Manzanas Rojas Orgánicas (MOCK)',
      description: 'Datos de prueba - Backend no conectado',
      price: 15.99,
      producer: { _id: '1', name: 'Finca Los Manzanos' },
      category: { _id: '1', name: 'Frutas' },
      images: [{ url: '/images/manzanas.jpg', isPrimary: true }],
      stock: 100,
      unit: 'kg',
      isOrganic: true,
      isAvailable: true,
      isFeatured: true,
      tags: ['manzana', 'orgánico']
    }
  ];
};

const getMockCategories = () => {
  return [
    { _id: '1', name: 'Frutas', description: 'Frutas frescas', icon: 'fas fa-apple-alt' },
    { _id: '2', name: 'Verduras', description: 'Verduras frescas', icon: 'fas fa-carrot' },
    { _id: '3', name: 'Lácteos', description: 'Productos lácteos', icon: 'fas fa-cheese' }
  ];
};

const getMockProducers = () => {
  return [
    { _id: '1', name: 'Finca Los Manzanos', email: 'contacto@losmanzanos.com' },
    { _id: '2', name: 'Lácteos San José', email: 'info@lacteossanjose.com' }
  ];
};

const getMockLocations = () => {
  return [
    { _id: '1', city: 'Tunja', department: 'Boyacá' },
    { _id: '2', city: 'Bogotá', department: 'Cundinamarca' }
  ];
};
