// backend/routes/users.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

/**
 * Rutas de Usuarios (Solo Admin)
 */

// @route   GET /api/users
// @desc    Obtener todos los usuarios
// @access  Private/Admin
router.get('/', protect, admin, getUsers);

// @route   GET /api/users/:id
// @desc    Obtener usuario por ID
// @access  Private/Admin
router.get('/:id', protect, admin, getUserById);

// @route   PUT /api/users/:id
// @desc    Actualizar usuario
// @access  Private/Admin
router.put('/:id', protect, admin, updateUser);

// @route   PUT /api/users/:id/role
// @desc    Cambiar rol de usuario
// @access  Private/Admin
router.put('/:id/role', protect, admin, updateUserRole);

// @route   DELETE /api/users/:id
// @desc    Eliminar usuario
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
