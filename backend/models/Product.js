// backend/models/Product.js
const mongoose = require('mongoose');

/**
 * Esquema de Producto
 * Define los productos disponibles en la plataforma
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [1000, 'La descripción no puede exceder 1000 caracteres']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida']
  },
  producer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producer',
    required: [true, 'El productor es requerido']
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo']
  },
  unit: {
    type: String,
    required: [true, 'La unidad de medida es requerida'],
    enum: ['kg', 'g', 'lb', 'unidad', 'litro', 'ml', 'docena', 'paquete']
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  isOrganic: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
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
  },
  tags: [String],
  seo: {
    metaTitle: String,
    metaDescription: String,
    slug: {
      type: String,
      unique: true
    }
  }
}, {
  timestamps: true
});

// Índices para búsquedas optimizadas
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isAvailable: 1 });
productSchema.index({ producer: 1, isAvailable: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'rating.average': -1 });

// Poblar automáticamente categoría y productor
productSchema.pre(/^find/, function(next) {
  this.populate('category').populate('producer');
  next();
});

// Generar slug automáticamente
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.seo.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
