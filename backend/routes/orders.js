// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  getUserOrders,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const { validateOrder, handleValidationErrors } = require('../utils/validators');

/**
 * Rutas de Pedidos
 */

// @route   GET /api/orders
// @desc    Obtener todos los pedidos (Admin) o pedidos del usuario
// @access  Private
router.get('/', protect, getOrders);

// @route   GET /api/orders/my
// @desc    Obtener pedidos del usuario actual
// @access  Private
router.get('/my', protect, getUserOrders);

// @route   GET /api/orders/:id
// @desc    Obtener pedido por ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   POST /api/orders
// @desc    Crear nuevo pedido
// @access  Private
router.post('/', 
  protect, 
  validateOrder, 
  handleValidationErrors, 
  createOrder
);

// @route   PUT /api/orders/:id/status
// @desc    Actualizar estado del pedido
// @access  Private/Admin
router.put('/:id/status', protect, admin, updateOrderStatus);

// @route   DELETE /api/orders/:id
// @desc    Eliminar pedido
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
