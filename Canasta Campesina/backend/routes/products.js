// backend/routes/products.js
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { validateProduct, handleValidationErrors } = require('../utils/validators');
const upload = require('../config/multer');

/**
 * Rutas de Productos
 */

// @route   GET /api/products
// @desc    Obtener todos los productos con filtros
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/featured
// @desc    Obtener productos destacados
// @access  Public
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/:id
// @desc    Obtener producto por ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Crear nuevo producto
// @access  Private/Admin
router.post('/', 
  protect, 
  admin, 
  upload.array('images', 5), 
  validateProduct, 
  handleValidationErrors, 
  createProduct
);

// @route   PUT /api/products/:id
// @desc    Actualizar producto
// @access  Private/Admin
router.put('/:id', 
  protect, 
  admin, 
  upload.array('images', 5), 
  updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Eliminar producto
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
