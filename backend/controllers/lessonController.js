const lessonService = require('../services/lessonService');
const { clearCache } = require('../middleware/cache');
const logger = require('../config/logger');

class LessonController {
    async getLessonById(req, res) {
        try {
            const lessonId = req.params.id;
            const userId = req.user.id;
            const isAdmin = req.user.role === 'admin' && req.headers['x-view-as-student'] !== 'true';

            const result = await lessonService.getLessonById(lessonId, userId, isAdmin);
            if (!result) return res.status(404).json({ error: 'Lección no encontrada' });
            if (result.locked) return res.status(403).json(result);

            // Si se otorgó una insignia, no queremos cachear esta respuesta específica
            // porque el modal de insignia ganada es un evento único.
            if (result.badgeAwarded) {
                res._doNotCache = true;
            }

            res.json({ success: true, ...result });
        } catch (error) {
            logger.error('Error en lección:', error);
            res.status(500).json({ error: 'Error al cargar la lección' });
        }
    }

    async completeLesson(req, res) {
        try {
            const lessonId = req.params.id;
            const userId = req.user.id;
            const isAdminView = req.user.role === 'admin' && req.headers['x-view-as-student'] !== 'true';

            await clearCache(`cache:/api/dashboard*u${userId}*`);
            await clearCache(`cache:/api/gamification/leaderboard*`);
            await clearCache(`cache:/api/modules*u${userId}*`);
            await clearCache(`cache:/api/lessons/*u${userId}*`);

            const result = await lessonService.completeLesson(lessonId, userId, isAdminView);
            res.json({ success: true, message: 'Lección completada', ...result });
        } catch (error) {
            logger.error('Error al completar lección:', error);
            res.status(400).json({ error: error.message || 'Error al registrar progreso' });
        }
    }

    async createLesson(req, res) {
        try {
            const lessonId = await lessonService.createLesson(req.body);
            
            // Limpiar caché después de la operación exitosa
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            res.status(201).json({ success: true, lessonId });
        } catch (error) {
            logger.error('Error creando lección:', error);
            res.status(500).json({ error: 'Error al crear lección' });
        }
    }

    async updateLesson(req, res) {
        try {
            const lessonId = req.params.id;
            await lessonService.updateLesson(lessonId, req.body);

            // Limpiar caché después de la operación exitosa
            await clearCache(`cache:/api/lessons/${lessonId}*`);
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            res.json({ success: true, message: 'Lección actualizada' });
        } catch (error) {
            logger.error('Error actualizando lección:', error);
            res.status(500).json({ error: 'Error al actualizar lección' });
        }
    }

    async reorderLessons(req, res) {
        try {
            const { moduleId, orderedIds } = req.body;
            logger.info(`Reordenando lecciones para módulo ${moduleId}:`, orderedIds);
            
            if (!moduleId || !orderedIds) {
                return res.status(400).json({ error: 'Faltan parámetros requeridos (moduleId, orderedIds)' });
            }

            await lessonService.reorderLessons(moduleId, orderedIds);

            // Limpiar caché después de la operación exitosa
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/lessons*');
            await clearCache('cache:/api/dashboard*');

            res.json({ success: true, message: 'Lecciones reordenadas con éxito' });
        } catch (error) {
            logger.error('Error reordenando lecciones:', error);
            res.status(500).json({ error: error.message || 'Error al reordenar lecciones' });
        }
    }

    async deleteLesson(req, res) {
        try {
            const lessonId = req.params.id;
            await lessonService.deleteLesson(lessonId);

            // Limpiar caché después de la operación exitosa
            await clearCache(`cache:/api/lessons/${lessonId}*`);
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            res.json({ success: true, message: 'Lección eliminada' });
        } catch (error) {
            logger.error('Error eliminando lección:', error);
            res.status(500).json({ error: 'Error al eliminar lección' });
        }
    }
}

module.exports = new LessonController();
