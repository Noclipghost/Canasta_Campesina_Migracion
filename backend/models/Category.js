// backend/models/Category.js
const mongoose = require('mongoose');

/**
 * Esquema de Categoría
 * Define las categorías de productos
 */
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es requerido'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  icon: {
    type: String,
    default: 'fas fa-tag'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
