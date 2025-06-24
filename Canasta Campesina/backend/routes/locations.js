// backend/routes/locations.js
const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');
const { protect, admin } = require('../middleware/auth');
const { validateLocation, handleValidationErrors } = require('../utils/validators');

/**
 * Rutas de Ubicaciones
 */

// @route   GET /api/locations
// @desc    Obtener todas las ubicaciones
// @access  Public
router.get('/', getLocations);

// @route   GET /api/locations/:id
// @desc    Obtener ubicación por ID
// @access  Public
router.get('/:id', getLocationById);

// @route   POST /api/locations
// @desc    Crear nueva ubicación
// @access  Private/Admin
router.post('/', 
  protect, 
  admin, 
  validateLocation, 
  handleValidationErrors, 
  createLocation
);

// @route   PUT /api/locations/:id
// @desc    Actualizar ubicación
// @access  Private/Admin
router.put('/:id', 
  protect, 
  admin, 
  updateLocation
);

// @route   DELETE /api/locations/:id
// @desc    Eliminar ubicación
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteLocation);

module.exports = router;
