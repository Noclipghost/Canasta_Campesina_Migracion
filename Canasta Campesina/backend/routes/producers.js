// backend/routes/producers.js
const express = require('express');
const router = express.Router();
const {
  getProducers,
  getProducerById,
  createProducer,
  updateProducer,
  deleteProducer
} = require('../controllers/producerController');
const { protect, admin } = require('../middleware/auth');
const { validateProducer, handleValidationErrors } = require('../utils/validators');
const upload = require('../config/multer');

/**
 * Rutas de Productores
 */

// @route   GET /api/producers
// @desc    Obtener todos los productores
// @access  Public
router.get('/', getProducers);

// @route   GET /api/producers/:id
// @desc    Obtener productor por ID
// @access  Public
router.get('/:id', getProducerById);

// @route   POST /api/producers
// @desc    Crear nuevo productor
// @access  Private/Admin
router.post('/', 
  protect, 
  admin, 
  upload.single('avatar'),
  validateProducer, 
  handleValidationErrors, 
  createProducer
);

// @route   PUT /api/producers/:id
// @desc    Actualizar productor
// @access  Private/Admin
router.put('/:id', 
  protect, 
  admin, 
  upload.single('avatar'),
  updateProducer
);

// @route   DELETE /api/producers/:id
// @desc    Eliminar productor
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProducer);

module.exports = router;
