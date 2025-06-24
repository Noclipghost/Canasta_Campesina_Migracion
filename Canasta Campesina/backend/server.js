// backend/server.js
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const config = require('./config/config');

// Conectar a la base de datos
connectDB();

// Iniciar servidor
const PORT = config.app.port;
const server = app.listen(PORT, () => {
  console.log(`
🚀 Servidor Canasta Campesina iniciado
📍 Puerto: ${PORT}
🌍 Entorno: ${config.app.env}
📅 Fecha: ${new Date().toLocaleString()}
  `);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err, promise) => {
  console.error('Error no manejado:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});
