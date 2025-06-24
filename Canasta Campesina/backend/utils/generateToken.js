// backend/utils/generateToken.js
const jwt = require('jsonwebtoken');
const config = require('../config/config');

/**
 * Generar JWT Token
 * @param {string} id - ID del usuario
 * @returns {string} - Token JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, {
    expiresIn: config.jwt.expire
  });
};

module.exports = generateToken;
