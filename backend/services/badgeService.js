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
        const { name, description, icon_name, criteria_type, criteria_value } = badgeData;
        
        const result = await db.query(
            'INSERT INTO badges (name, description, icon_name, criteria_type, criteria_value) VALUES (?, ?, ?, ?, ?)',
            [name, description, icon_name || 'Award', criteria_type || 'manual', criteria_value || null]
        );
        
        return result.insertId;
    }

    async updateBadge(id, badgeData) {
        const { name, description, icon_name, criteria_type, criteria_value } = badgeData;
        
        // Use COALESCE to keep existing values if new ones are null/undefined
        return await db.query(
            `UPDATE badges SET 
                name = COALESCE(?, name), 
                description = COALESCE(?, description), 
                icon_name = COALESCE(?, icon_name), 
                criteria_type = COALESCE(?, criteria_type), 
                criteria_value = COALESCE(?, criteria_value) 
            WHERE id = ?`,
            [name ?? null, description ?? null, icon_name ?? null, criteria_type ?? null, criteria_value ?? null, id]
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

    async awardBadge(userId, badgeId) {
        // INSERT IGNORE to prevent duplicate badges for the same user
        return await db.query(
            'INSERT IGNORE INTO user_badges (user_id, badge_id) VALUES (?, ?)',
            [userId, badgeId]
        );
    }
}

module.exports = new BadgeService();
