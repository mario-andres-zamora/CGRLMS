const { clearCache } = require('../middleware/cache');
const lessonContentService = require('../services/lessonContentService');
const logger = require('../config/logger');

class LessonContentController {
    async getLessonContents(req, res) {
        try {
            const { lessonId } = req.params;
            const userId = req.user.id;
            const contents = await lessonContentService.getLessonContents(lessonId, userId);
            res.json({ success: true, contents });
        } catch (error) {
            logger.error('Error obteniendo contenidos:', error);
            res.status(500).json({ error: 'Error al cargar contenidos' });
        }
    }

    async trackProgress(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            const responseData = req.body;
            await lessonContentService.trackContentProgress(id, userId, responseData);
            res.json({ success: true, message: 'Progreso registrado' });
        } catch (error) {
            logger.error('Error registrando progreso de contenido:', error);
            res.status(500).json({ error: 'Error al registrar progreso' });
        }
    }

    async submitAssignment(req, res) {
        try {
            if (!req.file) return res.status(400).json({ error: 'Se requiere un archivo' });
            const fileUrl = await lessonContentService.submitAssignment(req.params.contentId, req.user.id, req.file);
            res.json({ success: true, message: 'Tarea enviada correctamente. Espere a ser calificado.', file_url: fileUrl });
        } catch (error) {
            logger.error('Error enviando tarea:', error);
            res.status(500).json({ error: 'Error al enviar tarea' });
        }
    }

    async getAllSubmissions(req, res) {
        try {
            const submissions = await lessonContentService.getAllSubmissions();
            res.json({ success: true, submissions });
        } catch (error) {
            logger.error('Error obteniendo todas las entregas:', error);
            res.status(500).json({ error: 'Error al cargar las entregas' });
        }
    }

    async getAllInteractions(req, res) {
        try {
            const interactions = await lessonContentService.getAllInteractions();
            res.json({ success: true, interactions });
        } catch (error) {
            logger.error('Error obteniendo todas las interacciones:', error);
            res.status(500).json({ error: 'Error al cargar interacciones' });
        }
    }

    async getSubmissionsByContent(req, res) {
        try {
            const submissions = await lessonContentService.getSubmissionsByContent(req.params.contentId);
            res.json({ success: true, submissions });
        } catch (error) {
            logger.error('Error obteniendo entregas por contenido:', error);
            res.status(500).json({ error: 'Error al cargar entregas' });
        }
    }

    async gradeSubmission(req, res) {
        try {
            await lessonContentService.gradeSubmission(req.params.submissionId, req.body);
            res.json({ success: true, message: 'Entrega evaluada correctamente' });
        } catch (error) {
            logger.error('Error evaluando entrega:', error);
            res.status(500).json({ error: 'Error al evaluar entrega' });
        }
    }

    async createContent(req, res) {
        try {
            const { lesson_id } = req.body;
            await clearCache(`cache:/api/lessons/${lesson_id}*`);
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            const result = await lessonContentService.createContent(req.body, req.file);
            res.status(201).json({
                success: true,
                message: 'Contenido agregado correctamente',
                contentId: result.id,
                fileUrl: result.fileUrl
            });
        } catch (error) {
            logger.error('Error creando contenido:', error);
            res.status(500).json({ error: 'Error al crear contenido' });
        }
    }

    async updateContent(req, res) {
        try {
            const { id } = req.params;
            // Clear all lesson-related caches as we don't have lessonId easily here without a query
            // but we can at least clear the general patterns
            await clearCache('cache:/api/lessons*');
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            await lessonContentService.updateContent(id, req.body, req.file);
            res.json({ success: true, message: 'Contenido actualizado correctamente' });
        } catch (error) {
            logger.error('Error actualizando contenido:', error);
            res.status(500).json({ error: 'Error al actualizar contenido' });
        }
    }

    async deleteContent(req, res) {
        try {
            await clearCache('cache:/api/lessons*');
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            await lessonContentService.deleteContent(req.params.id);
            res.json({ success: true, message: 'Contenido eliminado correctamente' });
        } catch (error) {
            logger.error('Error eliminando contenido:', error);
            res.status(500).json({ error: 'Error al eliminar contenido' });
        }
    }

    async reorderContents(req, res) {
        try {
            await clearCache('cache:/api/lessons*');
            await lessonContentService.reorderContents(req.body.items);
            res.json({ success: true, message: 'Orden actualizado' });
        } catch (error) {
            logger.error('Error reordenando contenido:', error);
            res.status(500).json({ error: 'Error al reordenar' });
        }
    }

    async getInteractionStats(req, res) {
        try {
            const stats = await lessonContentService.getInteractionStats();
            res.json({ success: true, stats });
        } catch (error) {
            logger.error('Error obteniendo estadísticas de interacciones:', error);
            res.status(500).json({ error: 'Error al cargar estadísticas' });
        }
    }
}

module.exports = new LessonContentController();
