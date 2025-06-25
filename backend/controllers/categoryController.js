// backend/controllers/categoryController.js
const Category = require('../models/Category');

/**
 * Controlador de Categorías
 * Maneja todas las operaciones CRUD de categorías
 */

/**
 * @desc    Obtener todas las categorías
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    res.json({
      success: true,
      data: {
        categories
      }
    });

  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener categoría por ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    res.json({
      success: true,
      data: {
        category
      }
    });

  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Crear nueva categoría
 * @route   POST /api/categories
 * @access  Private/Admin
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Verificar si la categoría ya existe
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con este nombre'
      });
    }

    const category = await Category.create({
      name,
      description,
      icon
    });

    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: {
        category
      }
    });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Actualizar categoría
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: {
        category: updatedCategory
      }
    });

  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Eliminar categoría
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
