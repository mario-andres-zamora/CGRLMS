const express = require('express');
const router = express.Router();

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
        const { answers } = req.body;

        await connection.beginTransaction();

        // 1. Verificar si ya respondió
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
        if (answers && typeof answers === 'object') {
            const answerEntries = Object.entries(answers);
            logger.info(`Procesando ${answerEntries.length} respuestas para encuesta ${surveyId}`);
            
            for (const [qId, ans] of answerEntries) {
                await connection.query(
                    'INSERT INTO survey_answers (response_id, question_id, answer_text, option_id) VALUES (?, ?, ?, ?)',
                    [responseId, qId, ans.text || null, ans.optionId || null]
                );
            }
        }

        // 4. Otorgar puntos de gamificación
        let pointsAwarded = 0;
        const [contentRows] = await connection.query(
            "SELECT points FROM lesson_contents WHERE content_type = 'survey' AND JSON_VALUE(data, '$.survey_id') = ?",
            [surveyId]
        );

        if (contentRows && contentRows.length > 0) {
            pointsAwarded = contentRows[0].points;
        } else {
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

        // Limpiar caché
        await clearCache(`cache:/api/lessons/*u${userId}*`);
        await clearCache(`cache:/api/dashboard*u${userId}*`);
        await clearCache(`cache:/api/modules*u${userId}*`);
        await clearCache('cache:/api/gamification/leaderboard*');

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
 * @route   GET /api/surveys
 * @desc    Obtener todas las encuestas con estadísticas de respuestas
 * @access  Private/Admin
 */
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const surveys = await db.query(`
            SELECT 
                s.id, s.title, s.description, s.points, s.created_at,
                m.title as module_title, 
                l.title as lesson_title,
                (SELECT COUNT(*) FROM survey_responses sr WHERE sr.survey_id = s.id) as response_count
            FROM surveys s
            LEFT JOIN modules m ON s.module_id = m.id
            LEFT JOIN lessons l ON s.lesson_id = l.id
            ORDER BY s.id DESC
        `);
        res.json({ success: true, surveys });
    } catch (error) {
        logger.error('Error al obtener encuestas:', error);
        res.status(500).json({ error: 'Error al obtener encuestas' });
    }
});

/**
 * @route   POST /api/surveys
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
 * @route   GET /api/surveys/questions/:questionId/text-answers
 * @desc    Obtener respuestas de texto paginadas para una pregunta específica con búsqueda
 * @access  Private/Admin
 */
router.get('/questions/:questionId/text-answers', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { questionId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const offset = (page - 1) * limit;

        let queryStr = 'SELECT answer_text as text FROM survey_answers WHERE question_id = ? AND answer_text IS NOT NULL AND answer_text != ""';
        let countQueryStr = 'SELECT COUNT(*) as total FROM survey_answers WHERE question_id = ? AND answer_text IS NOT NULL AND answer_text != ""';
        const params = [questionId];

        if (search) {
            queryStr += ' AND answer_text LIKE ?';
            countQueryStr += ' AND answer_text LIKE ?';
            params.push(`%${search}%`);
        }

        const [countResult] = await db.query(countQueryStr, params);
        const total = countResult.total;

        queryStr += ' ORDER BY id DESC LIMIT ? OFFSET ?';
        const answers = await db.query(queryStr, [...params, limit, offset]);

        res.json({
            success: true,
            answers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Error al obtener respuestas de texto paginadas:', error);
        res.status(500).json({ error: 'Error al cargar las respuestas' });
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

/**
 * Lógica compartida para analíticas
 */
async function handleAnalytics(req, res) {
    const surveyId = req.params.id;

    const [survey] = await db.query('SELECT title, description FROM surveys WHERE id = ?', [surveyId]);
    if (!survey) return res.status(404).json({ error: 'Encuesta no encontrada' });

    const [respCount] = await db.query('SELECT COUNT(*) as total FROM survey_responses WHERE survey_id = ?', [surveyId]);
    const totalResponses = respCount.total;

    const questions = await db.query(
        'SELECT id, question_text, question_type, order_index FROM survey_questions WHERE survey_id = ? ORDER BY order_index ASC',
        [surveyId]
    );

    const analytics = [];

    for (const q of questions) {
        let data = [];
        
        const qType = q.question_type?.toLowerCase();

        if (qType === 'rating') {
            const counts = await db.query(
                'SELECT answer_text as label, COUNT(*) as value FROM survey_answers WHERE question_id = ? GROUP BY answer_text',
                [q.id]
            );
            for (let i = 1; i <= 5; i++) {
                const found = counts.find(c => parseInt(c.label) === i);
                data.push({ label: `${i}★`, value: found ? found.value : 0 });
            }
        } 
        else if (qType === 'multiple_choice') {
            data = await db.query(
                `SELECT so.option_text as label, COUNT(sa.id) as value 
                 FROM survey_options so 
                 LEFT JOIN survey_answers sa ON so.id = sa.option_id 
                 WHERE so.question_id = ? 
                 GROUP BY so.id 
                 ORDER BY so.order_index ASC`,
                [q.id]
            );
        }
        else if (qType === 'text') {
            const [countResult] = await db.query(
                'SELECT COUNT(*) as total FROM survey_answers WHERE question_id = ? AND answer_text IS NOT NULL AND answer_text != ""',
                [q.id]
            );
            const total = countResult.total;

            const answers = await db.query(
                'SELECT answer_text as text FROM survey_answers WHERE question_id = ? AND answer_text IS NOT NULL AND answer_text != "" ORDER BY id DESC LIMIT 5',
                [q.id]
            );

            data = {
                answers,
                total,
                page: 1,
                limit: 5,
                totalPages: Math.ceil(total / 5)
            };
        }

        analytics.push({
            questionId: q.id,
            text: q.question_text,
            type: q.question_type,
            data: data
        });
    }

    return res.json({
        success: true,
        survey: {
            id: surveyId,
            title: survey.title,
            totalResponses
        },
        analytics
    });
}

/**
 * Lógica para exportación a CSV
 */
async function handleExport(req, res) {
    try {
        const surveyId = req.params.id;
        
        const [survey] = await db.query('SELECT title FROM surveys WHERE id = ?', [surveyId]);
        if (!survey) return res.status(404).json({ error: 'Encuesta no encontrada' });

        const questions = await db.query(
            'SELECT id, question_text FROM survey_questions WHERE survey_id = ? ORDER BY order_index ASC',
            [surveyId]
        );

        const rows = await db.query(`
            SELECT 
                u.email as usuario,
                sr.submitted_at as fecha,
                sa.question_id,
                COALESCE(sa.answer_text, so.option_text) as respuesta,
                sr.id as response_id
            FROM survey_responses sr
            JOIN users u ON sr.user_id = u.id
            JOIN survey_answers sa ON sr.id = sa.response_id
            LEFT JOIN survey_options so ON sa.option_id = so.id
            WHERE sr.survey_id = ?
            ORDER BY sr.submitted_at DESC, sr.id DESC
        `, [surveyId]);

        const responsesMap = {};
        rows.forEach(row => {
            if (!responsesMap[row.response_id]) {
                responsesMap[row.response_id] = {
                    usuario: row.usuario,
                    fecha: new Date(row.fecha).toISOString().split('T')[0], // YYYY-MM-DD
                    respuestas: {}
                };
            }
            responsesMap[row.response_id].respuestas[row.question_id] = row.respuesta;
        });

        const BOM = '\ufeff';
        const headers = ['Usuario', 'Fecha', ...questions.map(q => q.question_text)];
        let csvContent = BOM + headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';

        Object.values(responsesMap).forEach(resp => {
            const rowData = [
                `"${resp.usuario}"`,
                `"${resp.fecha}"`,
                ...questions.map(q => {
                    const val = (resp.respuestas[q.id] || '').toString();
                    return `"${val.replace(/"/g, '""')}"`;
                })
            ];
            csvContent += rowData.join(',') + '\n';
        });

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=resultados_${survey.title.replace(/[^a-z0-9]/gi, '_')}.csv`);
        res.status(200).send(csvContent);
    } catch (error) {
        logger.error('Error en exportacion CSV:', error);
        res.status(500).json({ error: 'Error al exportar los datos' });
    }
}

/**
 * @route   GET /api/surveys/lesson/:lessonId/analytics
 */
router.get('/lesson/:lessonId/analytics', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const [survey] = await db.query('SELECT id FROM surveys WHERE lesson_id = ? LIMIT 1', [lessonId]);
        
        if (!survey) {
            const [content] = await db.query(
                "SELECT JSON_VALUE(data, '$.survey_id') as survey_id FROM lesson_contents WHERE lesson_id = ? AND content_type = 'survey' LIMIT 1",
                [lessonId]
            );
            
            if (!content || !content.survey_id) {
                return res.status(404).json({ error: 'No se encontró encuesta para esta lección' });
            }
            req.params.id = content.survey_id;
        } else {
            req.params.id = survey.id;
        }

        return await handleAnalytics(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar' });
    }
});

/**
 * @route   GET /api/surveys/lesson/:lessonId/export
 */
router.get('/lesson/:lessonId/export', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const lessonId = req.params.lessonId;
        const [survey] = await db.query('SELECT id FROM surveys WHERE lesson_id = ? LIMIT 1', [lessonId]);
        
        if (!survey) {
            const [content] = await db.query(
                "SELECT JSON_VALUE(data, '$.survey_id') as survey_id FROM lesson_contents WHERE lesson_id = ? AND content_type = 'survey' LIMIT 1",
                [lessonId]
            );
            if (!content || !content.survey_id) return res.status(404).json({ error: 'No se encontró encuesta' });
            req.params.id = content.survey_id;
        } else {
            req.params.id = survey.id;
        }

        return await handleExport(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error al exportar' });
    }
});

/**
 * @route   GET /api/surveys/:id/analytics
 */
router.get('/:id/analytics', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await handleAnalytics(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error al procesar las estadísticas' });
    }
});

/**
 * @route   GET /api/surveys/:id/export
 */
router.get('/:id/export', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        await handleExport(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Error al exportar' });
    }
});

module.exports = router;
