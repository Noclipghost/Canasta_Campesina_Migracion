// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateLogin,
  handleValidationErrors
} = require('../utils/validators');

/**
 * Rutas de Autenticación
 */

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Public
router.post('/register', validateUserRegistration, handleValidationErrors, register);

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', validateLogin, handleValidationErrors, login);

// @route   GET /api/auth/profile
// @desc    Obtener perfil del usuario actual
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
// @desc    Actualizar perfil del usuario
// @access  Private
router.put('/profile', protect, updateProfile);

// @route   PUT /api/auth/change-password
// @desc    Cambiar contraseña
// @access  Private
router.put('/change-password', protect, changePassword);

module.exports = router;
