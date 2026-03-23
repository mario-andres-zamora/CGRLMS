const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const db = require('../config/database');
const logger = require('../config/logger');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
    /**
     * Procesa la autenticación con Google OAuth
     * @param {string} credential - Access Token de Google
     */
    async googleAuth(credential) {
        // Obtener información del usuario usando el access_token
        const googleResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${credential}` }
        });

        const payload = googleResponse.data;
        const email = payload.email;
        const googleId = payload.sub;
        const given_name = payload.given_name || '';
        const family_name = payload.family_name || '';
        const picture = payload.picture || null;

        // Buscar o crear usuario
        let userResults = await db.query(
            'SELECT * FROM users WHERE email = ? OR google_id = ?',
            [email, googleId]
        );

        let user;
        if (userResults.length === 0) {
            // Buscar información en el directorio maestro de funcionarios
            const [directoryInfo] = await db.query(
                'SELECT department, full_name, position FROM staff_directory WHERE email = ?',
                [email]
            );

            // Determinar rol inicial
            const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
            const role = (defaultAdminEmail && email.toLowerCase() === defaultAdminEmail.toLowerCase()) ? 'admin' : 'student';

            // Crear nuevo usuario
            const result = await db.query(
                `INSERT INTO users (
                    email, google_id, first_name, last_name, 
                    profile_picture, role, department, position, is_active, last_login
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW())`,
                [
                    email,
                    googleId,
                    given_name,
                    family_name,
                    picture,
                    role,
                    directoryInfo?.department || null,
                    directoryInfo?.position || null
                ]
            );

            const newUserResults = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = newUserResults[0];

            // Crear registro de gamificación para nuevo usuario
            await db.query(
                'INSERT INTO user_points (user_id, points, level) VALUES (?, 0, "Novato")',
                [user.id]
            );

            logger.info(`Nuevo usuario registrado: ${email}`);
        } else {
            user = userResults[0];

            // Si el usuario existe pero no tiene departamento o puesto, y el directorio sí lo tiene, actualizarlo
            const [directoryInfo] = await db.query(
                'SELECT department, position FROM staff_directory WHERE email = ?',
                [email]
            );

            if (directoryInfo) {
                if (!user.department || !user.position) {
                    await db.query(
                        'UPDATE users SET department = ?, position = ? WHERE id = ?',
                        [directoryInfo.department || user.department, directoryInfo.position || user.position, user.id]
                    );
                }
            }

            // Actualizar última conexión y foto de perfil
            await db.query(
                'UPDATE users SET last_login = NOW(), profile_picture = ? WHERE id = ?',
                [picture || user.profile_picture, user.id]
            );

            // Recargar datos actualizados
            const updatedUserResults = await db.query('SELECT * FROM users WHERE id = ?', [user.id]);
            user = updatedUserResults[0];
        }

        return user;
    }

    /**
     * Obtiene estadísticas del usuario
     */
    async getUserStats(userId) {
        const [stats] = await db.query(
            `SELECT 
                (SELECT COUNT(*) FROM user_progress WHERE user_id = ? AND status = 'completed') as completed_lessons,
                (SELECT points FROM user_points WHERE user_id = ?) as points,
                (SELECT level FROM user_points WHERE user_id = ?) as level
            `,
            [userId, userId, userId]
        );
        return stats || { completed_lessons: 0, points: 0, level: 'Novato' };
    }

    /**
     * Registra actividad de login/logout
     */
    async logActivity(userId, action, ip, userAgent) {
        await db.query(
            `INSERT INTO activity_logs (user_id, action, ip_address, user_agent) 
             VALUES (?, ?, ?, ?)`,
            [userId, action, ip, userAgent || null]
        );
    }
    
    /**
     * Obtiene información extendida de un usuario para la verificación de sesión
     */
    async getSessionUserInfo(userId) {
        const [user] = await db.query(
            `SELECT u.id, u.email, u.first_name, u.last_name, u.profile_picture, u.role, u.is_active,
                    up.points, up.level
             FROM users u
             LEFT JOIN user_points up ON u.id = up.user_id
             WHERE u.id = ?`,
            [userId]
        );
        return user;
    }
}

module.exports = new AuthService();
