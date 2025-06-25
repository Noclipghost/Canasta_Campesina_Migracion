// backend/config/config.js
require('dotenv').config();

module.exports = {
  app: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001'
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/canasta_campesina',
    testUri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/canasta_campesina_test'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback_secret_key',
    expire: process.env.JWT_EXPIRE || '30d'
  },
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || 5000000,
    uploadPath: process.env.UPLOAD_PATH || './uploads'
  },
  rateLimit: {
    windowMs: (process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 100
  }
};
