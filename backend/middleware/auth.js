// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

/**
 * Middleware de autenticación
 * Verifica que el usuario esté autenticado
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Obtener token del header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Verificar si existe token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, token requerido'
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Obtener usuario del token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado, usuario no encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Cuenta desactivada'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(401).json({
      success: false,
      message: 'No autorizado, token inválido'
    });
  }
};

/**
 * Middleware para verificar rol de administrador
 */
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado, se requieren privilegios de administrador'
    });
  }
};

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero agrega usuario si existe
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      if (token) {
        const decoded = jwt.verify(token, config.jwt.secret);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // Si hay error con el token, simplemente continúa sin usuario
    next();
  }
};
