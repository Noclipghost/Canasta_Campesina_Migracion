// backend/controllers/productController.js
const Product = require('../models/Product');
const Category = require('../models/Category');
const Producer = require('../models/Producer');
const Location = require('../models/Location');
const fs = require('fs');
const path = require('path');

/**
 * Controlador de Productos
 * Maneja todas las operaciones CRUD de productos con manejo de imágenes
 */

/**
 * @desc    Obtener todos los productos con filtros
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      producer,
      location,
      priceMin,
      priceMax,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      isOrganic,
      isFeatured
    } = req.query;

    console.log('Filtros recibidos:', req.query);

    // Construir filtros base
    const filters = { isAvailable: true };

    // Filtro por categoría (buscar por nombre)
    if (category && category !== '') {
      try {
        const categoryDoc = await Category.findOne({ name: category });
        if (categoryDoc) {
          filters.category = categoryDoc._id;
          console.log('Filtro por categoría aplicado:', categoryDoc.name);
        } else {
          console.log('Categoría no encontrada:', category);
          return res.json({
            success: true,
            data: {
              products: [],
              pagination: {
                currentPage: parseInt(page),
                totalPages: 0,
                totalProducts: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            }
          });
        }
      } catch (error) {
        console.error('Error al buscar categoría:', error);
      }
    }

    // Filtro por productor (buscar por nombre)
    if (producer && producer !== '') {
      try {
        const producerDoc = await Producer.findOne({ name: producer });
        if (producerDoc) {
          filters.producer = producerDoc._id;
          console.log('Filtro por productor aplicado:', producerDoc.name);
        } else {
          console.log('Productor no encontrado:', producer);
          return res.json({
            success: true,
            data: {
              products: [],
              pagination: {
                currentPage: parseInt(page),
                totalPages: 0,
                totalProducts: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            }
          });
        }
      } catch (error) {
        console.error('Error al buscar productor:', error);
      }
    }

    // Filtro por ubicación (buscar productores en esa ubicación)
    if (location && location !== '') {
      try {
        console.log('Procesando filtro de ubicación:', location);
        
        const locationParts = location.split(',').map(part => part.trim());
        let locationQuery = {};
        
        if (locationParts.length >= 2) {
          locationQuery = {
            city: locationParts[0],
            department: locationParts[1]
          };
        } else {
          locationQuery = {
            $or: [
              { city: locationParts[0] },
              { department: locationParts[0] }
            ]
          };
        }
        
        console.log('Query de ubicación:', locationQuery);
        
        const locationDoc = await Location.findOne(locationQuery);
        console.log('Ubicación encontrada:', locationDoc);
        
        if (locationDoc) {
          const producersInLocation = await Producer.find({ location: locationDoc._id });
          console.log('Productores en ubicación:', producersInLocation.length);
          
          if (producersInLocation.length > 0) {
            const producerIds = producersInLocation.map(p => p._id);
            
            if (filters.producer) {
              const isProducerInLocation = producerIds.some(id => id.equals(filters.producer));
              if (!isProducerInLocation) {
                return res.json({
                  success: true,
                  data: {
                    products: [],
                    pagination: {
                      currentPage: parseInt(page),
                      totalPages: 0,
                      totalProducts: 0,
                      hasNextPage: false,
                      hasPrevPage: false
                    }
                  }
                });
              }
            } else {
              filters.producer = { $in: producerIds };
            }
          } else {
            return res.json({
              success: true,
              data: {
                products: [],
                pagination: {
                  currentPage: parseInt(page),
                  totalPages: 0,
                  totalProducts: 0,
                  hasNextPage: false,
                  hasPrevPage: false
                }
              }
            });
          }
        } else {
          console.log('Ubicación no encontrada:', location);
          return res.json({
            success: true,
            data: {
              products: [],
              pagination: {
                currentPage: parseInt(page),
                totalPages: 0,
                totalProducts: 0,
                hasNextPage: false,
                hasPrevPage: false
              }
            }
          });
        }
      } catch (error) {
        console.error('Error al procesar filtro de ubicación:', error);
      }
    }

    // Filtros de precio
    if (priceMin || priceMax) {
      filters.price = {};
      if (priceMin) filters.price.$gte = parseFloat(priceMin);
      if (priceMax) filters.price.$lte = parseFloat(priceMax);
    }

    // Filtro de búsqueda por texto
    if (search) {
      filters.$text = { $search: search };
    }

    // Filtros adicionales
    if (isOrganic !== undefined) {
      filters.isOrganic = isOrganic === 'true';
    }

    if (isFeatured !== undefined) {
      filters.isFeatured = isFeatured === 'true';
    }

    console.log('Filtros MongoDB finales:', JSON.stringify(filters, null, 2));

    // Configurar paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Configurar ordenamiento
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Ejecutar consulta
    const products = await Product.find(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Contar total de documentos
    const total = await Product.countDocuments(filters);

    console.log(`Productos encontrados: ${products.length} de ${total} total`);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducts: total,
          hasNextPage: skip + products.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Obtener producto por ID
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        product
      }
    });

  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Crear nuevo producto con imágenes
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Convertir arrays que vienen como string desde FormData
    if (typeof productData.tags === 'string') {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch (e) {
        productData.tags = productData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    // Procesar imágenes subidas
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${productData.name} - Imagen ${index + 1}`,
        isPrimary: index === 0,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      }));
      
      console.log('Imágenes procesadas:', productData.images);
    }

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: {
        product
      }
    });

  } catch (error) {
    // Si hay error, eliminar archivos subidos
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, '../uploads/products', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`Archivo eliminado por error: ${file.filename}`);
        }
      });
    }

    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Actualizar producto con nuevas imágenes
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const updateData = { ...req.body };

    // Convertir arrays que vienen como string desde FormData
    if (typeof updateData.tags === 'string') {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch (e) {
        updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      }
    }

    // Si hay nuevas imágenes, procesarlas
    if (req.files && req.files.length > 0) {
      // ELIMINAR IMÁGENES ANTERIORES DEL DISCO
      if (product.images && product.images.length > 0) {
        product.images.forEach(image => {
          if (image.filename) {
            const filePath = path.join(__dirname, '../uploads/products', image.filename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Imagen anterior eliminada: ${image.filename}`);
            }
          }
        });
      }

      // Agregar nuevas imágenes
      updateData.images = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        alt: `${updateData.name || product.name} - Imagen ${index + 1}`,
        isPrimary: index === 0,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype
      }));
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: {
        product: updatedProduct
      }
    });

  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Eliminar producto y sus imágenes
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // ELIMINAR IMÁGENES DEL DISCO
    if (product.images && product.images.length > 0) {
      product.images.forEach(image => {
        if (image.filename) {
          const filePath = path.join(__dirname, '../uploads/products', image.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Imagen eliminada: ${image.filename}`);
          }
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener productos destacados
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      isFeatured: true, 
      isAvailable: true 
    })
    .limit(8)
    .sort({ 'rating.average': -1, createdAt: -1 });

    res.json({
      success: true,
      data: {
        products
      }
    });

  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
