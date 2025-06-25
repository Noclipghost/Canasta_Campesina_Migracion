// backend/models/Order.js
const mongoose = require('mongoose');

/**
 * Esquema de Pedido
 * Define los pedidos realizados por los usuarios
 */
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es requerido']
  },
  orderNumber: {
    type: String,
    unique: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser al menos 1']
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo']
    },
    subtotal: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'El total es requerido'],
    min: [0, 'El total no puede ser negativo']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'transfer', 'digital_wallet'],
    default: 'cash'
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    },
    zipCode: String,
    phone: {
      type: String,
      required: true
    }
  },
  deliveryDate: Date,
  notes: String,
  trackingNumber: String
}, {
  timestamps: true
});

// Generar número de pedido automáticamente
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `CC-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Poblar automáticamente usuario y productos
orderSchema.pre(/^find/, function(next) {
  this.populate('user', 'name email phone')
      .populate('items.product', 'name price images unit');
  next();
});

module.exports = mongoose.model('Order', orderSchema);
