// frontend/src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

/**
 * Proveedor de contexto para el carrito de compras
 * Maneja los productos agregados, cantidades y total
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Agregar producto al carrito
   * @param {Object} product - Producto a agregar
   * @param {number} quantity - Cantidad a agregar
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Si el producto ya existe, actualizar cantidad
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si es nuevo, agregarlo al carrito
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  /**
   * Remover producto del carrito
   * @param {number} productId - ID del producto a remover
   */
  const removeFromCart = (productId) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item._id !== productId)
    );
  };

  /**
   * Actualizar cantidad de un producto
   * @param {number} productId - ID del producto
   * @param {number} newQuantity - Nueva cantidad
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  /**
   * Limpiar todo el carrito
   */
  const clearCart = () => {
    setCartItems([]);
  };

  /**
   * Calcular el total del carrito
   * @returns {number} - Total en pesos
   */
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  /**
   * Obtener cantidad total de productos
   * @returns {number} - Cantidad total de items
   */
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * Abrir/cerrar carrito
   */
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isOpen,
    toggleCart,
    setIsOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook personalizado para usar el contexto del carrito
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

