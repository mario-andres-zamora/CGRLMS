const authService = require('../services/authService');
const logger = require('../config/logger');

class AuthController {
    /**
     * @route   POST /api/auth/google
     * @desc    Autenticación con Google OAuth (Session based)
     */
    async googleAuth(req, res) {
        try {
            const { credential } = req.body;

            // Delegar a la capa de servicio
            const user = await authService.googleAuth(credential);

            // Verificar que el usuario esté activo
            if (!user.is_active) {
                return res.status(403).json({
                    error: 'Cuenta desactivada',
                    message: 'Su cuenta ha sido desactivada. Contacte al administrador.'
                });
            }

            // Guardar sesión (Cookie HTTP-Only se enviará automáticamente)
            req.session.userId = user.id;
            req.session.email = user.email;

            // Registrar actividad
            await authService.logActivity(user.id, 'login', req.ip, req.get('user-agent'));

            // Obtener estadísticas complementarias
            const stats = await authService.getUserStats(user.id);

            res.json({
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    employeeId: user.employee_id,
                    department: user.department,
                    position: user.position,
                    role: user.role,
                    is_active: !!user.is_active,
                    profilePicture: user.profile_picture,
                    points: stats?.points || 0,
                    level: stats?.level || 'Novato',
                    stats: stats || { completed_lessons: 0 }
                }
            });

        } catch (error) {
            logger.error('Error en autenticación Google:', error);
            res.status(500).json({
                error: 'Error de autenticación',
                message: error.message || 'No se pudo verificar las credenciales de Google'
            });
        }
    }

    /**
     * @route   POST /api/auth/logout
     * @desc    Cerrar sesión y destruir cookie
     */
    async logout(req, res) {
        try {
            if (req.session.userId) {
                await authService.logActivity(req.session.userId, 'logout', req.ip);
            }

            req.session.destroy((err) => {
                if (err) {
                    logger.error('Error al destruir sesión:', err);
                    return res.status(500).json({ error: 'Error al cerrar sesión' });
                }
                res.clearCookie('connect.sid'); // Limpiar la cookie de sesión expresamente
                res.json({ success: true, message: 'Sesión cerrada correctamente' });
            });
        } catch (error) {
            logger.error('Error en logout:', error);
            res.status(500).json({ error: 'Error al cerrar sesión' });
        }
    }

    /**
     * @route   GET /api/auth/verify
     * @desc    Verificar sesión actual (Reemplaza verifyToken)
     */
    async verifySession(req, res) {
        try {
            const userId = req.session.userId;

            if (!userId) {
                return res.status(401).json({ error: 'Sesión expirada o no válida' });
            }

            const user = await authService.getSessionUserInfo(userId);

            if (!user || !user.is_active) {
                return res.status(401).json({ error: 'Usuario no válido o desactivado' });
            }

            res.json({
                valid: true,
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    profilePicture: user.profile_picture,
                    role: user.role,
                    is_active: !!user.is_active,
                    points: user.points || 0,
                    level: user.level || 'Novato'
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Error al verificar sesión' });
        }
    }
}

module.exports = new AuthController();
