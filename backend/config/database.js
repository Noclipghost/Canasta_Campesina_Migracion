// backend/config/database.js
const mongoose = require('mongoose');

/**
 * Configuración y conexión a MongoDB
 * Establece la conexión con la base de datos MongoDB
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    
    // Configurar eventos de conexión
    mongoose.connection.on('error', (err) => {
      console.error('Error de conexión MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB desconectado');
    });

    // Cerrar conexión cuando la aplicación termine
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Conexión MongoDB cerrada debido a terminación de la aplicación');
      process.exit(0);
    });

  } catch (error) {
    console.error('Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
