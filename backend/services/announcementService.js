const db = require('../config/database');
const logger = require('../config/logger');

class AnnouncementService {
    async getAllAnnouncements() {
        return await db.query(
            `SELECT a.*, m.title as module_title 
             FROM system_announcements a 
             LEFT JOIN modules m ON a.target_module_id = m.id 
             ORDER BY a.created_at DESC`
        );
    }

    async createAnnouncement(data) {
        const { title, content, is_active, target_module_id } = data;
        const result = await db.query(
            'INSERT INTO system_announcements (title, content, is_active, target_module_id) VALUES (?, ?, ?, ?)',
            [title, content, is_active ?? true, target_module_id || null]
        );
        return result.insertId;
    }

    async updateAnnouncement(id, data) {
        const { title, content, is_active, target_module_id } = data;
        await db.query(
            'UPDATE system_announcements SET title = ?, content = ?, is_active = ?, target_module_id = ? WHERE id = ?',
            [title, content, is_active, target_module_id || null, id]
        );
    }

    async deleteAnnouncement(id) {
        await db.query('DELETE FROM system_announcements WHERE id = ?', [id]);
    }

    async getActiveForUser(userId) {
        // Obtenemos todos los anuncios activos que el usuario NO ha descartado aún
        const announcements = await db.query(
            `SELECT a.* 
             FROM system_announcements a
             LEFT JOIN user_announcements_dismissed d ON a.id = d.announcement_id AND d.user_id = ?
             WHERE a.is_active = TRUE AND d.announcement_id IS NULL
             ORDER BY a.created_at DESC`,
            [userId]
        );

        if (announcements.length === 0) return null;

        // Filtrar por targeting de módulo completado
        for (const announcement of announcements) {
            if (!announcement.target_module_id) {
                return announcement; // Es global
            }

            // Verificar si el usuario terminó el módulo requerido
            const [progress] = await db.query(
                'SELECT status FROM user_progress WHERE user_id = ? AND module_id = ? AND status = "completed"',
                [userId, announcement.target_module_id]
            );

            if (progress) {
                return announcement;
            }
        }

        return null;
    }

    async dismissForUser(userId, announcementId) {
        await db.query(
            'INSERT IGNORE INTO user_announcements_dismissed (user_id, announcement_id) VALUES (?, ?)',
            [userId, announcementId]
        );
    }
}

module.exports = new AnnouncementService();
