// backend/controllers/orderController.js
const Order = require('../models/Order');
const Product = require('../models/Product');

/**
 * Controlador de Pedidos
 */

/**
 * @desc    Obtener pedidos (todos para admin, propios para usuario)
 * @route   GET /api/orders
 * @access  Private
 */
exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let filters = {};

    // Si no es admin, solo mostrar sus propios pedidos
    if (req.user.role !== 'admin') {
      filters.user = req.user._id;
    }

    if (status) {
      filters.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filters)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filters);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener pedidos del usuario actual
 * @route   GET /api/orders/my
 * @access  Private
 */
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        orders
      }
    });

  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener pedido por ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    // Verificar que el usuario pueda ver este pedido
    if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver este pedido'
      });
    }

    res.json({
      success: true,
      data: {
        order
      }
    });

  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Crear nuevo pedido
 * @route   POST /api/orders
 * @access  Private
 */
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El pedido debe tener al menos un producto'
      });
    }

    // Verificar productos y calcular total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Producto ${item.product} no encontrado`
        });
      }

      if (!product.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Producto ${product.name} no está disponible`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${product.name}`
        });
      }

      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });

      // Actualizar stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: {
        order
      }
    });

  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Actualizar estado del pedido
 * @route   PUT /api/orders/:id/status
 * @access  Private/Admin
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de pedido inválido'
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.deliveryDate = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Estado del pedido actualizado exitosamente',
      data: {
        order
      }
    });

  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Eliminar pedido
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Pedido eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
