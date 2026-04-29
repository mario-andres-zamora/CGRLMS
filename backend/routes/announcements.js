const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Rutas de Usuario
router.get('/active', authMiddleware, announcementController.getActive);
router.post('/:id/dismiss', authMiddleware, announcementController.dismiss);

// Rutas de Administrador
router.get('/admin', authMiddleware, adminMiddleware, announcementController.getAllAdmin);
router.post('/', authMiddleware, adminMiddleware, announcementController.createAnnouncement);
router.put('/:id', authMiddleware, adminMiddleware, announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware, adminMiddleware, announcementController.deleteAnnouncement);

module.exports = router;
