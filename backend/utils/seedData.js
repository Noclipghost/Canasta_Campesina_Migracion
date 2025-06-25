// backend/utils/seedData.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Location = require('../models/Location');
const Producer = require('../models/Producer');
const Product = require('../models/Product');

const connectDB = require('../config/database');

/**
 * Script para poblar la base de datos con datos de prueba
 */

const seedData = async () => {
  try {
    await connectDB();

    // Limpiar datos existentes
    await User.deleteMany({});
    await Category.deleteMany({});
    await Location.deleteMany({});
    await Producer.deleteMany({});
    await Product.deleteMany({});

    console.log('Datos existentes eliminados');

    // Crear usuarios
    const users = await User.create([
      {
        name: 'Administrador',
        email: 'admin@canasta.com',
        password: 'admin123',
        role: 'admin',
        phone: '+57 300 123 4567'
      },
      {
        name: 'Usuario Demo',
        email: 'usuario@canasta.com',
        password: 'user123',
        role: 'user',
        phone: '+57 300 765 4321'
      }
    ]);

    console.log('Usuarios creados');

    // Crear categorías
    const categories = await Category.create([
      {
        name: 'Frutas',
        description: 'Frutas frescas y de temporada',
        icon: 'fas fa-apple-alt'
      },
      {
        name: 'Verduras',
        description: 'Verduras y hortalizas frescas',
        icon: 'fas fa-carrot'
      },
      {
        name: 'Lácteos',
        description: 'Productos lácteos artesanales',
        icon: 'fas fa-cheese'
      },
      {
        name: 'Granos',
        description: 'Granos y cereales',
        icon: 'fas fa-seedling'
      },
      {
        name: 'Endulzantes',
        description: 'Endulzantes naturales',
        icon: 'fas fa-candy-cane'
      }
    ]);

    console.log('Categorías creadas');

    // Crear ubicaciones
    const locations = await Location.create([
      {
        city: 'Tunja',
        department: 'Boyacá',
        country: 'Colombia'
      },
      {
        city: 'Bogotá',
        department: 'Cundinamarca',
        country: 'Colombia'
      },
      {
        city: 'Neiva',
        department: 'Huila',
        country: 'Colombia'
      },
      {
        city: 'Medellín',
        department: 'Antioquia',
        country: 'Colombia'
      },
      {
        city: 'Bucaramanga',
        department: 'Santander',
        country: 'Colombia'
      }
    ]);

    console.log('Ubicaciones creadas');

    // Crear productores
    const producers = await Producer.create([
      {
        name: 'Finca Los Manzanos',
        email: 'contacto@losmanzanos.com',
        phone: '+57 300 111 2222',
        location: locations[0]._id,
        description: 'Productores de frutas orgánicas en Boyacá',
        farmingMethods: ['orgánico'],
        farmSize: 15
      },
      {
        name: 'Lácteos San José',
        email: 'info@lacteossanjose.com',
        phone: '+57 300 333 4444',
        location: locations[1]._id,
        description: 'Productos lácteos artesanales',
        farmingMethods: ['tradicional'],
        farmSize: 25
      },
      {
        name: 'Café de las Montañas',
        email: 'ventas@cafemontanas.com',
        phone: '+57 300 555 6666',
        location: locations[2]._id,
        description: 'Café de altura premium',
        farmingMethods: ['orgánico'],
        farmSize: 10
      },
      {
        name: 'Huerta Verde',
        email: 'contacto@huertaverde.com',
        phone: '+57 300 777 8888',
        location: locations[3]._id,
        description: 'Verduras hidropónicas',
        farmingMethods: ['hidropónico'],
        farmSize: 5
      },
      {
        name: 'Apiario El Roble',
        email: 'miel@elroble.com',
        phone: '+57 300 999 0000',
        location: locations[4]._id,
        description: 'Productores de miel natural',
        farmingMethods: ['orgánico'],
        farmSize: 8
      }
    ]);

    console.log('Productores creados');

    // Crear productos
    const products = await Product.create([
      {
        name: 'Manzanas Rojas Orgánicas',
        description: 'Manzanas frescas y jugosas cultivadas sin químicos en las montañas de Boyacá. Perfectas para consumo directo o preparación de postres.',
        price: 15.99,
        category: categories[0]._id, // Frutas
        producer: producers[0]._id,
        stock: 100,
        unit: 'kg',
        isOrganic: true,
        isFeatured: true,
        tags: ['manzana', 'fruta', 'orgánico', 'boyacá'],
        images: [{
          url: '/uploads/manzanas.jpg',
          alt: 'Manzanas rojas orgánicas',
          isPrimary: true
        }]
      },
      {
        name: 'Queso Campesino Artesanal',
        description: 'Queso fresco elaborado con leche de vacas alimentadas con pasto natural. Sabor auténtico y textura cremosa.',
        price: 25.50,
        category: categories[2]._id, // Lácteos
        producer: producers[1]._id,
        stock: 50,
        unit: 'unidad',
        isFeatured: true,
        tags: ['queso', 'lácteo', 'artesanal', 'fresco'],
        images: [{
          url: '/uploads/queso.jpg',
          alt: 'Queso campesino artesanal',
          isPrimary: true
        }]
      },
      {
        name: 'Café Orgánico de Altura',
        description: 'Café premium cultivado a más de 1800 metros sobre el nivel del mar. Tostado medio con notas frutales y achocolatadas.',
        price: 35.00,
        category: categories[3]._id, // Granos
        producer: producers[2]._id,
        stock: 75,
        unit: 'paquete',
        isOrganic: true,
        isFeatured: true,
        tags: ['café', 'orgánico', 'altura', 'premium'],
        images: [{
          url: '/uploads/cafe.jpg',
          alt: 'Café orgánico de altura',
          isPrimary: true
        }]
      },
      {
        name: 'Tomates Cherry Hidropónicos',
        description: 'Tomates cherry dulces y jugosos cultivados en invernaderos tecnificados. Ideales para ensaladas y decoración.',
        price: 8.99,
        category: categories[1]._id, // Verduras
        producer: producers[3]._id,
        stock: 80,
        unit: 'kg',
        tags: ['tomate', 'cherry', 'hidropónico', 'ensalada'],
        images: [{
          url: '/uploads/tomates.jpg',
          alt: 'Tomates cherry hidropónicos',
          isPrimary: true
        }]
      },
      {
        name: 'Miel de Abeja Pura',
        description: 'Miel 100% natural de flores silvestres, sin procesar ni pasteurizar. Rica en antioxidantes y propiedades medicinales.',
        price: 18.75,
        category: categories[4]._id, // Endulzantes
        producer: producers[4]._id,
        stock: 60,
        unit: 'unidad',
        isOrganic: true,
        tags: ['miel', 'natural', 'flores', 'antioxidantes'],
        images: [{
          url: '/uploads/miel.jpg',
          alt: 'Miel de abeja pura',
          isPrimary: true
        }]
      }
    ]);

    console.log('Productos creados');
    console.log('✅ Datos de prueba creados exitosamente');
    
    process.exit(0);

  } catch (error) {
    console.error('Error al crear datos de prueba:', error);
    process.exit(1);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedData();
}

module.exports = seedData;
