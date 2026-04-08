const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

/**
 * @route   GET /api/lessons/:id
 * @desc    Obtener detalles de una lección y progreso del usuario
 * @access  Private
 */
router.get('/:id', authMiddleware, cacheMiddleware(600, true), lessonController.getLessonById);

/**
 * @route   POST /api/lessons/:id/complete
 * @desc    Marcar lección como completada
 * @access  Private
 */
router.post('/:id/complete', authMiddleware, lessonController.completeLesson);

/**
 * @route   POST /api/lessons
 * @desc    Crear nueva lección
 * @access  Private/Admin
 */
router.post('/', authMiddleware, adminMiddleware, lessonController.createLesson);

/**
 * @route   PUT /api/lessons/:id
 * @desc    Actualizar lección
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, adminMiddleware, lessonController.updateLesson);

/**
 * @route   POST /api/lessons/reorder
 * @desc    Reordenar lecciones de un módulo
 * @access  Private/Admin
 */
router.post('/reorder', authMiddleware, adminMiddleware, lessonController.reorderLessons);

/**
 * @route   DELETE /api/lessons/:id
 * @desc    Eliminar lección
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, adminMiddleware, lessonController.deleteLesson);

module.exports = router;
