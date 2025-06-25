// backend/models/Producer.js
const mongoose = require('mongoose');

/**
 * Esquema de Productor
 * Define los productores campesinos
 */
const producerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del productor es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un email válido'
    ]
  },
  phone: {
    type: String,
    required: [true, 'El teléfono es requerido'],
    trim: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'La ubicación es requerida']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  certifications: [{
    name: String,
    issuedBy: String,
    validUntil: Date
  }],
  farmSize: {
    type: Number,
    min: [0, 'El tamaño de la finca no puede ser negativo']
  },
  farmingMethods: [{
    type: String,
    enum: ['orgánico', 'tradicional', 'hidropónico', 'agroecológico']
  }],
  avatar: {
    type: String,
    default: 'default-producer.jpg'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Poblar automáticamente la ubicación
producerSchema.pre(/^find/, function(next) {
  this.populate('location');
  next();
});

module.exports = mongoose.model('Producer', producerSchema);
