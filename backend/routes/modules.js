const express = require('express');
const router = express.Router();
const moduleController = require('../controllers/moduleController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

/**
 * @route   GET /api/modules
 * @desc    Obtener módulos
 * @access  Private
 */
router.get('/', authMiddleware, cacheMiddleware(600, true), (req, res) => moduleController.getModules(req, res));

/**
 * @route   GET /api/modules/admin/all
 * @desc    Obtener todos (Admin)
 * @access  Private/Admin
 */
router.get('/admin/all', authMiddleware, adminMiddleware, (req, res) => moduleController.getAllAdmin(req, res));

/**
 * @route   GET /api/modules/:id
 * @desc    Obtener detalle de un módulo con sus lecciones
 * @access  Private
 */
router.get('/:id', authMiddleware, cacheMiddleware(600, true), (req, res) => moduleController.getModuleById(req, res));

/**
 * @route   POST /api/modules
 * @desc    Crear un nuevo módulo
 * @access  Private/Admin
 */
router.post('/', authMiddleware, adminMiddleware, (req, res) => moduleController.createModule(req, res));

/**
 * @route   PUT /api/modules/:id
 * @desc    Actualizar un módulo
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => moduleController.updateModule(req, res));

/**
 * @route   DELETE /api/modules/:id
 * @desc    Eliminar un módulo
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => moduleController.deleteModule(req, res));

module.exports = router;
