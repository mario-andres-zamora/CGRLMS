const db = require('../config/database');
const logger = require('../config/logger');

/**
 * Servicio para enviar notificaciones in-app
 */
class NotificationService {
    /**
     * Crea una notificación para un usuario
     * @param {number} userId - ID del usuario destino
     * @param {string} title - Título breve de la notificación
     * @param {string} message - Mensaje detallado
     * @param {string} type - 'info', 'success', 'warning', 'danger'
     * @param {string} linkUrl - URL opcional a donde redirige al hacer clic
     */
    async createNotification(userId, title, message, type = 'info', linkUrl = null) {
        try {
            await db.query(
                `INSERT INTO notifications (user_id, title, message, notification_type, link_url) 
                 VALUES (?, ?, ?, ?, ?)`,
                [userId, title, message, type, linkUrl]
            );
            return true;
        } catch (error) {
            logger.error('Error creating notification:', error);
            return false;
        }
    }

    /**
     * Crea notificaciones masivas
     * @param {Array<number>} userIds - Arreglo de IDs de usuarios
     */
    async createMassiveNotification(userIds, title, message, type = 'info', linkUrl = null) {
        if (!userIds || userIds.length === 0) return false;
        try {
            const values = userIds.map(id => [id, title, message, type, linkUrl]);
            await db.query(
                `INSERT INTO notifications (user_id, title, message, notification_type, link_url) 
                 VALUES ?`,
                [values]
            );
            return true;
        } catch (error) {
            logger.error('Error creating massive notifications:', error);
            return false;
        }
    }
}

module.exports = new NotificationService();
