const quizService = require('../services/quizService');
const { clearCache } = require('../middleware/cache');
const logger = require('../config/logger');

class QuizController {
    async getQuizById(req, res) {
        try {
            const quizId = req.params.id;
            const userId = req.user.id;
            const result = await quizService.getQuizById(quizId, userId);
            if (!result) return res.status(404).json({ error: 'Evaluación no encontrada' });
            res.json({ success: true, ...result });
        } catch (error) {
            logger.error('Error al obtener quiz:', error);
            res.status(500).json({ error: 'Error al cargar la evaluación' });
        }
    }

    async getLastAttempt(req, res) {
        try {
            const userId = req.user.id;
            const quizId = req.params.id;
            const result = await quizService.getLastAttempt(quizId, userId);
            if (!result) return res.json({ success: false, message: 'No hay intentos previos' });
            res.json({ success: true, results: result });
        } catch (error) {
            logger.error('Error al obtener último intento:', error);
            res.status(500).json({ error: 'Error al obtener último intento' });
        }
    }

    async submitQuiz(req, res) {
        try {
            const quizId = req.params.id;
            const userId = req.user.id;
            const isAdminView = req.user.role === 'admin' && req.headers['x-view-as-student'] !== 'true';

            await clearCache(`cache:/api/dashboard*u${userId}*`);
            await clearCache(`cache:/api/gamification/leaderboard*`);
            await clearCache(`cache:/api/modules*u${userId}*`);
            await clearCache(`cache:/api/lessons/*u${userId}*`);
            await clearCache(`cache:/api/quizzes/${quizId}*u${userId}*`);

            const result = await quizService.submitQuiz(quizId, userId, req.body, isAdminView);
            res.json({ success: true, ...result });
        } catch (error) {
            logger.error('Error al calificar quiz:', error);
            res.status(400).json({ error: error.message || 'Error al procesar los resultados' });
        }
    }

    async createQuiz(req, res) {
        try {
            const quizId = await quizService.createQuiz(req.body);

            // Limpiar caché después de la operación exitosa
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            res.status(201).json({ success: true, message: 'Quiz creado', quizId });
        } catch (error) {
            logger.error('Error creando quiz:', error);
            res.status(500).json({ error: 'Error al crear la evaluación' });
        }
    }

    async getQuizAdmin(req, res) {
        try {
            const quizId = req.params.id;
            const result = await quizService.getQuizAdmin(quizId);
            if (!result) return res.status(404).json({ error: 'Quiz no encontrado' });
            res.json({ success: true, ...result });
        } catch (error) {
            logger.error('Error al cargar datos admin del quiz:', error);
            res.status(500).json({ error: 'Error al cargar datos de edición' });
        }
    }

    async updateQuiz(req, res) {
        try {
            const quizId = req.params.id;
            await quizService.updateQuiz(quizId, req.body);

            // Limpiar caché después de la operación exitosa
            await clearCache(`cache:/api/quizzes/${quizId}*`);
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            res.json({ success: true, message: 'Quiz actualizado' });
        } catch (error) {
            logger.error('Error al actualizar quiz:', error);
            res.status(500).json({ error: 'Error al actualizar' });
        }
    }

    async addQuestion(req, res) {
        try {
            const quizId = req.params.id;
            const questionId = await quizService.addQuestion(quizId, req.body);
            res.status(201).json({ success: true, questionId });
        } catch (error) {
            logger.error('Error al agregar pregunta:', error);
            res.status(500).json({ error: 'Error al agregar pregunta' });
        }
    }

    async updateQuestion(req, res) {
        try {
            const questionId = req.params.questionId;
            await quizService.updateQuestion(questionId, req.body);
            res.json({ success: true, message: 'Pregunta actualizada' });
        } catch (error) {
            logger.error('Error al actualizar pregunta:', error);
            res.status(500).json({ error: 'Error al actualizar pregunta' });
        }
    }

    async deleteQuestion(req, res) {
        try {
            const questionId = req.params.questionId;
            await quizService.deleteQuestion(questionId);
            res.json({ success: true, message: 'Pregunta eliminada' });
        } catch (error) {
            logger.error('Error al eliminar pregunta:', error);
            res.status(500).json({ error: 'Error al eliminar' });
        }
    }

    async deleteQuiz(req, res) {
        try {
            const quizId = req.params.id;
            await quizService.deleteQuiz(quizId);

            // Limpiar caché después de la operación exitosa
            await clearCache(`cache:/api/quizzes/${quizId}*`);
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');

            res.json({ success: true, message: 'Quiz eliminado' });
        } catch (error) {
            logger.error('Error al eliminar quiz:', error);
            res.status(500).json({ error: 'Error al eliminar' });
        }
    }
}

module.exports = new QuizController();
