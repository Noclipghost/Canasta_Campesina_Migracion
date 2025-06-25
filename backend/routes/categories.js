// backend/routes/categories.js
const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/auth');
const { validateCategory, handleValidationErrors } = require('../utils/validators');

/**
 * Rutas de Categorías
 */

// @route   GET /api/categories
// @desc    Obtener todas las categorías
// @access  Public
router.get('/', getCategories);

// @route   GET /api/categories/:id
// @desc    Obtener categoría por ID
// @access  Public
router.get('/:id', getCategoryById);

// @route   POST /api/categories
// @desc    Crear nueva categoría
// @access  Private/Admin
router.post('/', 
  protect, 
  admin, 
  validateCategory, 
  handleValidationErrors, 
  createCategory
);

// @route   PUT /api/categories/:id
// @desc    Actualizar categoría
// @access  Private/Admin
router.put('/:id', 
  protect, 
  admin, 
  updateCategory
);

// @route   DELETE /api/categories/:id
// @desc    Eliminar categoría
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
