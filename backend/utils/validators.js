// backend/utils/validators.js - Archivo corregido completo
const { body, validationResult } = require('express-validator');

/**
 * Validadores para diferentes entidades
 */

// Validador para registro de usuario
exports.validateUserRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
  
  body('phone')
    .optional()
    .isMobilePhone('es-CO')
    .withMessage('Debe proporcionar un número de teléfono válido')
];

// Validador para login
exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

// Validador para productos
exports.validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La descripción debe tener entre 10 y 1000 caracteres'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un número entero positivo'),
  
  body('category')
    .isMongoId()
    .withMessage('Debe proporcionar una categoría válida'),
  
  body('producer')
    .isMongoId()
    .withMessage('Debe proporcionar un productor válido'),
  
  body('unit')
    .isIn(['kg', 'g', 'lb', 'unidad', 'litro', 'ml', 'docena', 'paquete'])
    .withMessage('La unidad debe ser válida')
];

// Validador para categorías
exports.validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La descripción no puede exceder 200 caracteres'),
  
  body('icon')
    .optional()
    .trim()
    .isString()
    .withMessage('El icono debe ser una cadena válida')
];

// Validador para productores
exports.validateProducer = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe proporcionar un email válido'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido'),
  
  body('location')
    .isMongoId()
    .withMessage('Debe proporcionar una ubicación válida'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede exceder 500 caracteres')
];

// Validador para ubicaciones
exports.validateLocation = [
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('La ciudad debe tener entre 2 y 100 caracteres'),
  
  body('department')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El departamento debe tener entre 2 y 100 caracteres'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El país no puede exceder 100 caracteres')
];

// Validador para pedidos
exports.validateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('El pedido debe tener al menos un producto'),
  
  body('items.*.product')
    .isMongoId()
    .withMessage('ID de producto inválido'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser al menos 1'),
  
  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('La dirección es requerida'),
  
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('La ciudad es requerida'),
  
  body('shippingAddress.department')
    .trim()
    .notEmpty()
    .withMessage('El departamento es requerido'),
  
  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('El teléfono es requerido'),
  
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'transfer', 'digital_wallet'])
    .withMessage('Método de pago inválido'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Las notas no pueden exceder 500 caracteres')
];

// Middleware para manejar errores de validación
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array()
    });
  }
  
  next();
};
