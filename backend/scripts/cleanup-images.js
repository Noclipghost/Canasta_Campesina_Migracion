// backend/scripts/cleanup-images.js
const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const connectDB = require('../config/database');

const cleanupOrphanedImages = async () => {
  try {
    await connectDB();
    
    const uploadsDir = path.join(__dirname, '../uploads/products');
    const files = fs.readdirSync(uploadsDir);
    
    // Obtener todas las imágenes en uso
    const products = await Product.find({}, 'images');
    const usedImages = new Set();
    
    products.forEach(product => {
      if (product.images) {
        product.images.forEach(image => {
          if (image.filename) {
            usedImages.add(image.filename);
          }
        });
      }
    });
    
    // Eliminar archivos huérfanos
    let deletedCount = 0;
    files.forEach(file => {
      if (!usedImages.has(file)) {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        console.log(`Imagen huérfana eliminada: ${file}`);
        deletedCount++;
      }
    });
    
    console.log(`Limpieza completada. ${deletedCount} archivos eliminados.`);
    process.exit(0);
    
  } catch (error) {
    console.error('Error en limpieza:', error);
    process.exit(1);
  }
};

cleanupOrphanedImages();
