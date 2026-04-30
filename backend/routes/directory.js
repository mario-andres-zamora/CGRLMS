const express = require('express');
const router = express.Router();
const directoryController = require('../controllers/directoryController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @route   GET /api/directory
 * @desc    Obtener lista completa del directorio institucional con estado de registro
 * @access  Private/Admin
 */
router.get('/', authMiddleware, adminMiddleware, directoryController.getFullDirectory);

/**
 * @route   POST /api/directory/single
 * @desc    Agregar un funcionario individual
 * @access  Private/Admin
 */
router.post('/single', authMiddleware, adminMiddleware, directoryController.addSingleRecord);

/**
 * @route   POST /api/directory/upload
 * @desc    Subir CSV de funcionarios y sincronizar
 * @access  Private/Admin
 */
router.post('/upload', authMiddleware, adminMiddleware, upload.single('csv'), directoryController.uploadCSV);

/**
 * @route   PUT /api/directory/:email
 * @desc    Actualizar un registro del directorio maestro
 * @access  Private/Admin
 */
router.put('/:id', authMiddleware, adminMiddleware, directoryController.updateRecord);

/**
 * @route   DELETE /api/directory/:email
 * @desc    Eliminar un registro del directorio maestro
 * @access  Private/Admin
 */
router.delete('/:id', authMiddleware, adminMiddleware, directoryController.deleteRecord);

/**
 * @route   GET /api/directory/template
 * @desc    Descargar plantilla CSV para carga masiva
 * @access  Private/Admin
 */
router.get('/template', authMiddleware, adminMiddleware, directoryController.getTemplate);

/**
 * @route   POST /api/directory/invite
 * @desc    Enviar invitación individual por correo
 * @access  Private/Admin
 */
router.post('/invite', authMiddleware, adminMiddleware, directoryController.sendInvitation);

module.exports = router;
