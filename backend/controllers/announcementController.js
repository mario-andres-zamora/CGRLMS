const announcementService = require('../services/announcementService');
const logger = require('../config/logger');

class AnnouncementController {
    /**
     * @route   GET /api/announcements/admin
     * @desc    Obtener todos los anuncios (Admin)
     */
    async getAllAdmin(req, res) {
        try {
            const announcements = await announcementService.getAllAnnouncements();
            res.json({ success: true, announcements });
        } catch (error) {
            logger.error('Error obteniendo anuncios:', error);
            res.status(500).json({ error: 'Error al obtener anuncios' });
        }
    }

    /**
     * @route   POST /api/announcements
     * @desc    Crear un anuncio (Admin)
     */
    async createAnnouncement(req, res) {
        try {
            const id = await announcementService.createAnnouncement(req.body);
            res.status(201).json({ success: true, message: 'Anuncio creado correctamente', id });
        } catch (error) {
            logger.error('Error creando anuncio:', error);
            res.status(500).json({ error: 'Error al crear anuncio' });
        }
    }

    /**
     * @route   PUT /api/announcements/:id
     * @desc    Actualizar un anuncio (Admin)
     */
    async updateAnnouncement(req, res) {
        try {
            await announcementService.updateAnnouncement(req.params.id, req.body);
            res.json({ success: true, message: 'Anuncio actualizado correctamente' });
        } catch (error) {
            logger.error('Error actualizando anuncio:', error);
            res.status(500).json({ error: 'Error al actualizar anuncio' });
        }
    }

    /**
     * @route   DELETE /api/announcements/:id
     * @desc    Eliminar un anuncio (Admin)
     */
    async deleteAnnouncement(req, res) {
        try {
            await announcementService.deleteAnnouncement(req.params.id);
            res.json({ success: true, message: 'Anuncio eliminado correctamente' });
        } catch (error) {
            logger.error('Error eliminando anuncio:', error);
            res.status(500).json({ error: 'Error al eliminar anuncio' });
        }
    }

    /**
     * @route   GET /api/announcements/active
     * @desc    Obtener anuncio activo para el usuario actual
     */
    async getActive(req, res) {
        try {
            const announcement = await announcementService.getActiveForUser(req.user.id);
            res.json({ success: true, announcement });
        } catch (error) {
            logger.error('Error obteniendo anuncio activo:', error);
            res.status(500).json({ error: 'Error al obtener anuncio' });
        }
    }

    /**
     * @route   POST /api/announcements/:id/dismiss
     * @desc    Marcar anuncio como visto/descartado
     */
    async dismiss(req, res) {
        try {
            await announcementService.dismissForUser(req.user.id, req.params.id);
            res.json({ success: true, message: 'Anuncio descartado' });
        } catch (error) {
            logger.error('Error descartando anuncio:', error);
            res.status(500).json({ error: 'Error al descartar anuncio' });
        }
    }
}

module.exports = new AnnouncementController();
