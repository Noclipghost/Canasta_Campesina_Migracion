// backend/models/Location.js
const mongoose = require('mongoose');

/**
 * Esquema de Ubicación
 * Define las ubicaciones de los productores
 */
const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'La ciudad es requerida'],
    trim: true,
    maxlength: [100, 'La ciudad no puede exceder 100 caracteres']
  },
  department: {
    type: String,
    required: [true, 'El departamento es requerido'],
    trim: true,
    maxlength: [100, 'El departamento no puede exceder 100 caracteres']
  },
  country: {
    type: String,
    default: 'Colombia',
    trim: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice para búsquedas geográficas
locationSchema.index({ "coordinates.latitude": 1, "coordinates.longitude": 1 });

module.exports = mongoose.model('Location', locationSchema);
