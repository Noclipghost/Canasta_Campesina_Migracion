// backend/controllers/producerController.js
const Producer = require('../models/Producer');

/**
 * Controlador de Productores
 */

/**
 * @desc    Obtener todos los productores
 * @route   GET /api/producers
 * @access  Public
 */
exports.getProducers = async (req, res) => {
  try {
    const { page = 1, limit = 10, location } = req.query;

    const filters = { isActive: true };
    if (location) {
      filters.location = location;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const producers = await Producer.find(filters)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await Producer.countDocuments(filters);

    res.json({
      success: true,
      data: {
        producers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProducers: total
        }
      }
    });

  } catch (error) {
    console.error('Error al obtener productores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Obtener productor por ID
 * @route   GET /api/producers/:id
 * @access  Public
 */
exports.getProducerById = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id);

    if (!producer) {
      return res.status(404).json({
        success: false,
        message: 'Productor no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        producer
      }
    });

  } catch (error) {
    console.error('Error al obtener productor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Crear nuevo productor
 * @route   POST /api/producers
 * @access  Private/Admin
 */
exports.createProducer = async (req, res) => {
  try {
    const producerData = { ...req.body };

    // Si hay archivo subido, agregar URL del avatar
    if (req.file) {
      producerData.avatar = `/uploads/${req.file.filename}`;
    }

    const producer = await Producer.create(producerData);

    res.status(201).json({
      success: true,
      message: 'Productor creado exitosamente',
      data: {
        producer
      }
    });

  } catch (error) {
    console.error('Error al crear productor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Actualizar productor
 * @route   PUT /api/producers/:id
 * @access  Private/Admin
 */
exports.updateProducer = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id);

    if (!producer) {
      return res.status(404).json({
        success: false,
        message: 'Productor no encontrado'
      });
    }

    const updateData = { ...req.body };

    // Si hay nuevo avatar, actualizarlo
    if (req.file) {
      updateData.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedProducer = await Producer.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Productor actualizado exitosamente',
      data: {
        producer: updatedProducer
      }
    });

  } catch (error) {
    console.error('Error al actualizar productor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

/**
 * @desc    Eliminar productor
 * @route   DELETE /api/producers/:id
 * @access  Private/Admin
 */
exports.deleteProducer = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id);

    if (!producer) {
      return res.status(404).json({
        success: false,
        message: 'Productor no encontrado'
      });
    }

    await Producer.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Productor eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar productor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
