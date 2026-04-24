const db = require('../config/database');
const logger = require('../config/logger');

class BadgeService {
    async getAllBadges() {
        return await db.query('SELECT * FROM badges ORDER BY created_at DESC');
    }

    async getBadgeById(id) {
        const badges = await db.query('SELECT * FROM badges WHERE id = ?', [id]);
        return badges[0];
    }

    async createBadge(badgeData) {
        const { name, description, icon_name, image_url, criteria_type, criteria_value, points } = badgeData;
        
        const result = await db.query(
            'INSERT INTO badges (name, description, icon_name, image_url, criteria_type, criteria_value, points) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, description, icon_name || 'Award', image_url || null, criteria_type || 'manual', criteria_value || null, points ?? 10]
        );
        
        return result.insertId;
    }

    async updateBadge(id, badgeData) {
        const { name, description, icon_name, image_url, criteria_type, criteria_value, points } = badgeData;
        
        // Use COALESCE to keep existing values if new ones are null/undefined
        return await db.query(
            `UPDATE badges SET 
                name = COALESCE(?, name), 
                description = COALESCE(?, description), 
                icon_name = COALESCE(?, icon_name), 
                image_url = COALESCE(?, image_url),
                criteria_type = COALESCE(?, criteria_type), 
                criteria_value = COALESCE(?, criteria_value),
                points = COALESCE(?, points)
            WHERE id = ?`,
            [name ?? null, description ?? null, icon_name ?? null, image_url ?? null, criteria_type ?? null, criteria_value ?? null, points ?? null, id]
        );
    }

    async deleteBadge(id) {
        return await db.query('DELETE FROM badges WHERE id = ?', [id]);
    }

    async getUserBadges(userId) {
        return await db.query(`
            SELECT b.*, ub.earned_at 
            FROM badges b
            JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = ?
            ORDER BY ub.earned_at DESC
        `, [userId]);
    }

    async awardBadge(userId, badgeId, shouldNotify = false) {
        const badgesUtil = require('../utils/badges');
        return await badgesUtil.awardBadge(userId, badgeId, shouldNotify);
    }
}

module.exports = new BadgeService();
