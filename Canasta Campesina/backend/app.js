// backend/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const config = require('./config/config');

// Importar rutas
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const producerRoutes = require('./routes/producers');
const locationRoutes = require('./routes/locations');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');

const app = express();

// Configuración CORS
const corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3000',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ]
};

// Aplicar CORS ANTES que otros middlewares
app.use(cors(corsOptions));

// Manejar preflight requests explícitamente
app.options('*', cors(corsOptions));

// Middleware de seguridad (configurado para permitir CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting MÁS PERMISIVO para desarrollo
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto (en lugar de 15)
  max: 1000, // 1000 requests por minuto (en lugar de 100)
  message: {
    success: false,
    message: 'Demasiadas solicitudes, intente nuevamente más tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Excluir ciertas rutas del rate limiting
  skip: (req) => {
    // No aplicar rate limiting en desarrollo para rutas de API básicas
    if (process.env.NODE_ENV === 'development') {
      return req.url.startsWith('/api/') && 
             (req.url.includes('/products') || 
              req.url.includes('/categories') || 
              req.url.includes('/producers') || 
              req.url.includes('/locations') ||
              req.url.includes('/users') ||
              req.url.includes('/health'));
    }
    return false;
  }
});

// Aplicar rate limiting solo en producción o de forma muy permisiva en desarrollo
if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter);
} else {
  // Rate limiting muy permisivo para desarrollo
  const devLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 10000, // 10000 requests por minuto
    message: {
      success: false,
      message: 'Límite excedido en desarrollo'
    }
  });
  app.use('/api/', devLimiter);
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (config.app.env === 'development') {
  app.use(morgan('dev'));
}

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Middleware para logging de archivos
app.use('/uploads', (req, res, next) => {
  console.log(`Archivo solicitado: ${req.url}`);
  next();
});

// Middleware para logging de API requests
app.use('/api', (req, res, next) => {
  console.log(`API Request: ${req.method} ${req.url}`);
  next();
});

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/producers', producerRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: config.app.env
  });
});

// Manejo de rutas no encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  let message = 'Error interno del servidor';
  let statusCode = 500;

  // Errores de validación de Mongoose
  if (error.name === 'ValidationError') {
    message = Object.values(error.errors).map(err => err.message).join(', ');
    statusCode = 400;
  }

  // Error de duplicado de MongoDB
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    message = `Ya existe un registro con este ${field}`;
    statusCode = 400;
  }

  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    message = 'Token inválido';
    statusCode = 401;
  }

  // Error de multer
  if (error.code === 'LIMIT_FILE_SIZE') {
    message = 'El archivo es demasiado grande';
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: config.app.env === 'development' ? error.message : undefined
  });
});

module.exports = app;
