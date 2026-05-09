const userService = require('../services/userService');
const { clearCache } = require('../middleware/cache');
const logger = require('../config/logger');

class UserController {
    /**
     * @route   GET /api/users
     * @desc    Obtener todos los usuarios (Admin)
     */
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json({ success: true, users });
        } catch (error) {
            logger.error('Error obteniendo usuarios:', error);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    }

    /**
     * @route   GET /api/users/profile
     * @desc    Obtener perfil completo del funcionario
     */
    async getProfile(req, res) {
        try {
            const profileData = await userService.getUserProfileData(req.user.id);
            if (!profileData) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Incluir configuraciones globales relevantes
            const { getSystemSettings } = require('../utils/gamification');
            const settings = await getSystemSettings();
            if (profileData.user) {
                profileData.user.allowThemeChange = settings.allow_theme_change;
            }

            res.json({ success: true, ...profileData });
        } catch (error) {
            logger.error('Error detallado obteniendo perfil:', error);
            res.status(500).json({ error: 'Error al cargar el perfil', details: error.message });
        }
    }

    /**
     * @route   PUT /api/users/profile
     * @desc    Actualizar perfil propio (Usuario actual)
     */
    async updateProfile(req, res) {
        try {
            // Solo se permite que el usuario actualice su propia información sensible NO-ADMIN
            const profileData = {
                profile_picture: req.body.profile_picture
            };
            
            await userService.updateOwnProfile(req.user.id, profileData);
            
            // Limpiar caché del perfil
            await clearCache(`cache:/api/users/profile*u${req.user.id}*`);
            
            res.json({ success: true, message: 'Perfil actualizado correctamente' });
        } catch (error) {
            logger.error('Error actualizando perfil propio:', error);
            res.status(500).json({ error: 'Error al actualizar el perfil' });
        }
    }

    /**
     * @route   GET /api/users/:id/full-profile
     * @desc    Obtener perfil completo de cualquier funcionario (Admin)
     */
    async getFullProfile(req, res) {
        try {
            const profileData = await userService.getUserProfileData(req.params.id);
            if (!profileData) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Incluir configuraciones globales relevantes
            const { getSystemSettings } = require('../utils/gamification');
            const settings = await getSystemSettings();
            if (profileData.user) {
                profileData.user.allowThemeChange = settings.allow_theme_change;
            }

            res.json({ success: true, ...profileData });
        } catch (error) {
            logger.error('Error obteniendo perfil de usuario:', error);
            res.status(500).json({ error: 'Error al cargar el perfil' });
        }
    }

    /**
     * @route   GET /api/users/:id
     * @desc    Obtener un usuario específico (Admin)
     */
    async getUserById(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json({ success: true, user });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el usuario' });
        }
    }

    /**
     * @route   PUT /api/users/:id
     * @desc    Actualizar un usuario (Admin)
     */
    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const requestingUserId = req.user.id;

            // Seguridad: Prevenir que un admin se cambie su propio rol o se desactive a sí mismo
            if (userId == requestingUserId) {
                if (req.body.role && req.body.role !== req.user.role) {
                    return res.status(400).json({ error: 'No puedes cambiar tu propio rol.' });
                }
                if (req.body.is_active === false || req.body.is_active === 0) {
                    return res.status(400).json({ error: 'No puedes desactivar tu propia cuenta.' });
                }
            }

            await userService.updateUser(userId, req.body);
            res.json({ success: true, message: 'Usuario actualizado correctamente' });
        } catch (error) {
            logger.error('Error actualizando usuario:', error);
            res.status(500).json({ error: 'Error al actualizar usuario' });
        }
    }

    /**
     * @route   DELETE /api/users/:id
     * @desc    Eliminar un usuario (Admin)
     */
    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            if (userId == req.user.id) {
                return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta.' });
            }
            await userService.deleteUser(userId);
            res.json({ success: true, message: 'Usuario eliminado permanentemente' });
        } catch (error) {
            logger.error('Error eliminando usuario:', error);
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
    }

    /**
     * Reinicia el progreso de un usuario (Admin)
     */
    async resetProgress(req, res) {
        try {
            const userId = req.params.id;
            const { moduleId } = req.body;

            // Limpieza extensiva de caché para asegurar que el cambio se vea reflejado inmediatamente
            await clearCache(`cache:/api/dashboard*u${userId}*`);
            await clearCache(`cache:/api/users/profile*u${userId}*`);
            await clearCache(`cache:/api/users/${userId}/full-profile*`);
            await clearCache(`cache:/api/gamification/leaderboard*`);
            await clearCache(`cache:/api/gamification/ranking*`);
            await clearCache(`cache:/api/modules*u${userId}*`);
            await clearCache(`cache:/api/lessons*u${userId}*`);
            
            // Forzar actualización del ranking global e institucional
            await clearCache(`leaderboard:institutional`);
            await clearCache(`cache:/api/users*`); // Lista de usuarios de admin

            const result = await userService.resetUserProgress(userId, moduleId);

            // Sincronizar el ranking (Sorted Set) en Redis inmediatamente con los nuevos puntos
            const { updateUserScore } = require('../utils/gamification');
            await updateUserScore(userId, result.newPoints);

            res.json({ 
                success: true, 
                message: moduleId 
                    ? 'El progreso del módulo ha sido reiniciado correctamente'
                    : 'Todo el progreso del usuario ha sido reiniciado completamente',
                newPoints: result.newPoints,
                newLevel: result.newLevel 
            });
        } catch (error) {
            logger.error('Error al reiniciar usuario:', error);
            res.status(500).json({ error: 'Error al reiniciar el progreso del usuario' });
        }
    }
}

module.exports = new UserController();
