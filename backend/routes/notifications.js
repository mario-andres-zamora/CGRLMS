const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/notifications
 * @desc    Obtener todas las notificaciones del usuario
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await db.query(
            `SELECT * FROM notifications 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT 10`,
            [userId]
        );

        res.json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error('Error obteniendo notificaciones:', error);
        res.status(500).json({ error: 'Error al cargar notificaciones' });
    }
});

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Obtener conteo de notificaciones no leídas
 * @access  Private
 */
router.get('/unread-count', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const [result] = await db.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );

        res.json({
            success: true,
            count: result.count
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener conteo' });
    }
});

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Marcar una notificación como leída
 * @access  Private
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const notificationId = req.params.id;

        await db.query(
            'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE id = ? AND user_id = ?',
            [notificationId, userId]
        );

        res.json({ success: true, message: 'Notificación marcada como leída' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar notificación' });
    }
});

/**
 * @route   PUT /api/notifications/read-all
 * @desc    Marcar todas las notificaciones como leídas
 * @access  Private
 */
router.put('/read-all', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        await db.query(
            'UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = ? AND is_read = FALSE',
            [userId]
        );

        res.json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar notificaciones' });
    }
});

/**
 * @route   POST /api/notifications/send
 * @desc    Enviar notificaciones masivas (Admin)
 * @access  Private/Admin
 */
router.post('/send', authMiddleware, require('../middleware/auth').adminMiddleware, async (req, res) => {
    const connection = await db.pool.getConnection();
    try {
        const { title, message, type, link_url, filters } = req.body;

        if (!title || !message) {
            return res.status(400).json({ error: 'Título y mensaje son requeridos' });
        }

        await connection.beginTransaction();

        // Construir la consulta de usuarios basada en filtros
        let userQuery = 'SELECT id FROM users WHERE is_active = TRUE';
        let queryParams = [];

        if (filters) {
            if (filters.userIds && filters.userIds.length > 0) {
                userQuery += ' AND id IN (?)';
                queryParams.push(filters.userIds);
            } else {
                if (filters.department) {
                    userQuery += ' AND department = ?';
                    queryParams.push(filters.department);
                }
                if (filters.role) {
                    userQuery += ' AND role = ?';
                    queryParams.push(filters.role);
                }
            }
        }

        const [users] = await connection.query(userQuery, queryParams);

        if (users.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'No se encontraron usuarios que coincidan con los filtros' });
        }

        // Insertar notificaciones para cada usuario
        // notification_type puede ser 'info', 'success', 'warning', 'danger'
        const insertQuery = `
            INSERT INTO notifications (user_id, title, message, notification_type, link_url, created_at)
            VALUES ?
        `;

        const now = new Date();
        const values = users.map(user => [
            user.id,
            title,
            message,
            type || 'info',
            link_url || null,
            now
        ]);

        await connection.query(insertQuery, [values]);

        await connection.commit();

        res.json({
            success: true,
            message: `Notificación enviada a ${users.length} usuarios`,
            targetCount: users.length
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Error enviando notificaciones masivas:', error);
        res.status(500).json({ error: 'Error al enviar las notificaciones' });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
