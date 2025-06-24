// backend/controllers/locationController.js
const Location = require('../models/Location');

/**
 * Controlador de Ubicaciones
 */

/**
 * @desc    Obtener todas las ubicaciones
 * @route   GET /api/locations
 * @access  Public
 */
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find({ isActive: true })
      .sort({ department: 1, city: 1 });

    res.json({
      success: true,
      data: {
        locations
      }
    });

  } catch (error) {
    console.error('Error al obtener ubicaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener ubicación por ID
 * @route   GET /api/locations/:id
 * @access  Public
 */
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Ubicación no encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        location
      }
    });

  } catch (error) {
    console.error('Error al obtener ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Crear nueva ubicación
 * @route   POST /api/locations
 * @access  Private/Admin
 */
exports.createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Ubicación creada exitosamente',
      data: {
        location
      }
    });

  } catch (error) {
    console.error('Error al crear ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Actualizar ubicación
 * @route   PUT /api/locations/:id
 * @access  Private/Admin
 */
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Ubicación no encontrada'
      });
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Ubicación actualizada exitosamente',
      data: {
        location: updatedLocation
      }
    });

  } catch (error) {
    console.error('Error al actualizar ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Eliminar ubicación
 * @route   DELETE /api/locations/:id
 * @access  Private/Admin
 */
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Ubicación no encontrada'
      });
    }

    await Location.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Ubicación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar ubicación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
