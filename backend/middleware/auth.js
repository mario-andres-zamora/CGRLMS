const db = require('../config/database');
const logger = require('../config/logger');
const redisClient = require('../config/redis');

/**
 * Middleware de autenticación basado en Sesiones
 * Verifica la sesión de Redis y carga la información del usuario
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Verificar existencia de userId en la sesión
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ 
                error: 'Sesión no iniciada',
                message: 'No se detectó una sesión activa. Por favor inicie sesión.'
            });
        }

        // Marcar usuario como activo en Redis (expira en 5 minutos)
        if (redisClient && redisClient.isOpen) {
            redisClient.setEx(`online_user:${userId}`, 300, '1').catch(e => logger.error('Error setting online status:', e));
        }

        // Obtener usuario de la base de datos
        // Usamos cache o consulta directa dependiendo de la necesidad de frescura
        const [user] = await db.query(
            'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = ?',
            [userId]
        );

        if (!user) {
            // Si el usuario ya no existe, destruimos la sesión inválida
            req.session.destroy();
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        if (!user.is_active) {
            return res.status(403).json({ error: 'Usuario desactivado' });
        }

        // Agregar usuario al objeto request para uso posterior
        req.user = user;
        next();
    } catch (error) {
        logger.error('Error en middleware de autenticación:', error);
        return res.status(500).json({ error: 'Error interno del servidor en autenticación' });
    }
};

/**
 * Middleware para verificar rol de administrador
 */
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
            error: 'Acceso denegado',
            message: 'Se requieren permisos de administrador para realizar esta acción.'
        });
    }
    next();
};

/**
 * Middleware para verificar rol de instructor o admin
 */
const instructorMiddleware = (req, res, next) => {
    if (!req.user || (req.user.role !== 'instructor' && req.user.role !== 'admin')) {
        return res.status(403).json({ 
            error: 'Acceso denegado',
            message: 'Se requieren permisos de instructor o administrador.'
        });
    }
    next();
};

module.exports = {
    authMiddleware,
    adminMiddleware,
    instructorMiddleware
};
