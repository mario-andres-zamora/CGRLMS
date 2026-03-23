const express = require('express');

const logger = require('../config/logger');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { syncUserLevel, getSystemSettings } = require('../utils/gamification');
const { clearCache } = require('../middleware/cache');

/**
 * @route   GET /api/surveys/:id
 * @desc    Obtener una encuesta con sus preguntas y opciones
 * @access  Private
 */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const surveyId = req.params.id;
        const userId = req.user.id;

        // 1. Obtener datos de la encuesta
        const [survey] = await db.query(
            'SELECT * FROM surveys WHERE id = ?',
            [surveyId]
        );

        if (!survey) {
            return res.status(404).json({ error: 'Encuesta no encontrada' });
        }

        // Buscar puntos en lesson_contents para sincronizar con la lección
        const contentRows = await db.query(
            "SELECT points FROM lesson_contents WHERE content_type = 'survey' AND JSON_VALUE(data, '$.survey_id') = ?",
            [surveyId]
        );

        if (contentRows.length > 0) {
            survey.points = contentRows[0].points;
        }

        // 2. Verificar si el usuario ya respondió
        const responses = await db.query(
            'SELECT id, submitted_at FROM survey_responses WHERE user_id = ? AND survey_id = ?',
            [userId, surveyId]
        );

        // 3. Obtener preguntas
        const questions = await db.query(
            'SELECT id, question_text, question_type, order_index, is_required FROM survey_questions WHERE survey_id = ? ORDER BY order_index ASC',
            [surveyId]
        );

        // 4. Obtener opciones para cada pregunta
        for (let question of questions) {
            if (question.question_type !== 'text') {
                const options = await db.query(
                    'SELECT id, option_text, order_index FROM survey_options WHERE question_id = ? ORDER BY order_index ASC',
                    [question.id]
                );
                question.options = options;
            }
        }

        res.json({
            success: true,
            survey,
            questions,
            isCompleted: responses.length > 0,
            submittedAt: responses.length > 0 ? responses[0].submitted_at : null
        });
    } catch (error) {
        logger.error('Error al obtener encuesta:', error);
        res.status(500).json({ error: 'Error al cargar la encuesta' });
    }
});

/**
 * @route   POST /api/surveys/:id/submit
 * @desc    Enviar respuestas de una encuesta
 * @access  Private
 */
router.post('/:id/submit', authMiddleware, async (req, res) => {
    const connection = await db.pool.getConnection();
    try {
        const surveyId = req.params.id;
        const userId = req.user.id;
        const { answers } = req.body; // answers: { questionId: { text: '...', optionId: 123 } }

        await connection.beginTransaction();

        // 1. Verificar si ya respondió (para evitar duplicados)
        const [existing] = await connection.query(
            'SELECT id FROM survey_responses WHERE user_id = ? AND survey_id = ?',
            [userId, surveyId]
        );

        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Ya has completado esta encuesta' });
        }

        // 2. Crear la respuesta
        const [responseResult] = await connection.query(
            'INSERT INTO survey_responses (survey_id, user_id) VALUES (?, ?)',
            [surveyId, userId]
        );
        const responseId = responseResult.insertId;

        // 3. Guardar cada respuesta individual
        for (const questionId in answers) {
            const ans = answers[questionId];
            await connection.query(
                'INSERT INTO survey_answers (response_id, question_id, answer_text, option_id) VALUES (?, ?, ?, ?)',
                [responseId, questionId, ans.text || null, ans.optionId || null]
            );
        }

        // 4. Otorgar puntos de gamificación si es la primera vez
        // Buscamos los puntos definidos en lesson_contents (donde reside el survey vinculada a la lección)
        const [contentRows] = await connection.query(
            "SELECT points FROM lesson_contents WHERE content_type = 'survey' AND JSON_VALUE(data, '$.survey_id') = ?",
            [surveyId]
        );

        let pointsAwarded = 0;
        if (contentRows && contentRows.length > 0) {
            pointsAwarded = contentRows[0].points;
        } else {
            // Fallback: Si no hay en lesson_contents (poco probable), revisar la tabla surveys
            const [surveyRows] = await connection.query('SELECT points FROM surveys WHERE id = ?', [surveyId]);
            if (surveyRows && surveyRows.length > 0) {
                pointsAwarded = surveyRows[0].points || 0;
            }
        }

        if (pointsAwarded > 0) {
            await connection.query(
                'INSERT INTO user_points (user_id, points) VALUES (?, ?) ON DUPLICATE KEY UPDATE points = points + ?',
                [userId, pointsAwarded, pointsAwarded]
            );
            await connection.query(
                'INSERT INTO gamification_activities (user_id, activity_type, points_earned, reference_id) VALUES (?, "survey_completed", ?, ?)',
                [userId, pointsAwarded, surveyId]
            );
        }

        await connection.commit();

        // Invalida el caché
        await clearCache(`cache:/api/lessons/*u${userId}*`);
        await clearCache(`cache:/api/dashboard*u${userId}*`);

        // Sincronizar nivel
        const levelSync = await syncUserLevel(userId);

        res.json({
            success: true,
            message: 'Encuesta enviada correctamente',
            pointsAwarded,
            levelUp: levelSync?.leveledUp || false,
            newLevel: levelSync?.leveledUp ? levelSync.newLevel : levelSync?.currentLevel
        });

    } catch (error) {
        await connection.rollback();
        logger.error('Error al enviar encuesta:', error);
        res.status(500).json({ error: 'Error al procesar la encuesta' });
    } finally {
        connection.release();
    }
});

// --- Rutas de Admin ---

/**
 * @route   POST /api/surveys
 * @access  Private/Admin
 */
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { module_id, lesson_id, title, description, points } = req.body;
        const result = await db.query(
            'INSERT INTO surveys (module_id, lesson_id, title, description, points) VALUES (?, ?, ?, ?, ?)',
            [module_id, lesson_id, title, description || '', points || 0]
        );
        res.status(201).json({ success: true, surveyId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear encuesta' });
    }
});

/**
 * @route   GET /api/surveys/:id/admin
 * @access  Private/Admin
 */
router.get('/:id/admin', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const surveyId = req.params.id;
        const [survey] = await db.query('SELECT * FROM surveys WHERE id = ?', [surveyId]);
        if (!survey) return res.status(404).json({ error: 'Encuesta no encontrada' });

        const questions = await db.query(
            'SELECT * FROM survey_questions WHERE survey_id = ? ORDER BY order_index ASC',
            [surveyId]
        );

        for (let question of questions) {
            const options = await db.query(
                'SELECT * FROM survey_options WHERE question_id = ? ORDER BY order_index ASC',
                [question.id]
            );
            question.options = options;
        }

        res.json({ success: true, survey, questions });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar datos' });
    }
});

/**
 * @route   PUT /api/surveys/:id
 */
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, points } = req.body;
        await db.query(
            'UPDATE surveys SET title = ?, description = ?, points = ? WHERE id = ?',
            [title, description, points, req.params.id]
        );
        res.json({ success: true, message: 'Encuesta actualizada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar' });
    }
});

/**
 * @route   POST /api/surveys/:id/questions
 */
router.post('/:id/questions', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { question_text, question_type, is_required, order_index, options } = req.body;
        const surveyId = req.params.id;

        const result = await db.query(
            'INSERT INTO survey_questions (survey_id, question_text, question_type, is_required, order_index) VALUES (?, ?, ?, ?, ?)',
            [surveyId, question_text, question_type, is_required ? 1 : 0, order_index || 0]
        );
        const questionId = result.insertId;

        if (options && Array.isArray(options)) {
            for (let opt of options) {
                await db.query(
                    'INSERT INTO survey_options (question_id, option_text, order_index) VALUES (?, ?, ?)',
                    [questionId, opt.option_text, opt.order_index || 0]
                );
            }
        }

        res.status(201).json({ success: true, questionId });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar pregunta' });
    }
});

/**
 * @route   PUT /api/surveys/questions/:questionId
 */
router.put('/questions/:questionId', authMiddleware, adminMiddleware, async (req, res) => {
    const connection = await db.pool.getConnection();
    try {
        const { question_text, question_type, is_required, order_index, options } = req.body;
        const { questionId } = req.params;

        await connection.beginTransaction();

        await connection.query(
            'UPDATE survey_questions SET question_text = ?, question_type = ?, is_required = ?, order_index = ? WHERE id = ?',
            [question_text, question_type, is_required ? 1 : 0, order_index, questionId]
        );

        if (options && Array.isArray(options)) {
            await connection.query('DELETE FROM survey_options WHERE question_id = ?', [questionId]);
            for (let opt of options) {
                await connection.query(
                    'INSERT INTO survey_options (question_id, option_text, order_index) VALUES (?, ?, ?)',
                    [questionId, opt.option_text, opt.order_index || 0]
                );
            }
        }

        await connection.commit();
        res.json({ success: true });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: 'Error al actualizar' });
    } finally {
        connection.release();
    }
});

/**
 * @route   DELETE /api/surveys/questions/:questionId
 */
router.delete('/questions/:questionId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await db.query('DELETE FROM survey_questions WHERE id = ?', [req.params.questionId]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

/**
 * @route   DELETE /api/surveys/:id
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await db.query('DELETE FROM surveys WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

module.exports = router;
