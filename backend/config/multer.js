// backend/config/multer.js - Configuración completa para productos
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorios si no existen
const createDirectories = () => {
  const dirs = [
    './uploads',
    './uploads/products',
    './uploads/temp',
    './public/images'
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directorio creado: ${dir}`);
    }
  });
};

createDirectories();

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/products');
  },
  filename: function (req, file, cb) {
    // Generar nombre único: product-{timestamp}-{random}.{extension}
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${extension}`);
  }
});

// Filtro de archivos - solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (JPEG, JPG, PNG, GIF, WEBP)'), false);
  }
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo por archivo
    files: 5 // Máximo 5 archivos por producto
  },
  fileFilter: fileFilter
});

module.exports = upload;
