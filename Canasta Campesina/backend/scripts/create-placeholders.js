// backend/scripts/create-placeholders.js
const fs = require('fs');
const path = require('path');

// Crear archivo placeholder.jpg (puedes usar cualquier imagen por defecto)
const createPlaceholder = () => {
  const placeholderPath = path.join(__dirname, '../public/images/placeholder.jpg');
  
  if (!fs.existsSync(placeholderPath)) {
    // Aquí podrías copiar una imagen por defecto o crear una programáticamente
    console.log('Recuerda agregar una imagen placeholder.jpg en public/images/');
  }
};

createPlaceholder();
