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
            res.json({ success: true, ...profileData });
        } catch (error) {
            logger.error('Error detallado obteniendo perfil:', error);
            res.status(500).json({ error: 'Error al cargar el perfil', details: error.message });
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
            await userService.updateUser(req.params.id, req.body);
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
     * @route   POST /api/users/:id/reset
     * @desc    Reiniciar todo el progreso de un usuario (Admin)
     */
    async resetProgress(req, res) {
        try {
            const userId = req.params.id;

            // Limpieza de caché
            await clearCache(`cache:/api/dashboard*u${userId}*`);
            await clearCache(`cache:/api/users/profile*u${userId}*`);
            await clearCache(`cache:/api/gamification/leaderboard*`);
            await clearCache(`cache:/api/modules*u${userId}*`);
            await clearCache(`cache:/api/lessons*u${userId}*`);

            const result = await userService.resetUserProgress(userId);

            res.json({ 
                success: true, 
                message: 'El progreso del usuario ha sido reiniciado completamente',
                newPoints: 0,
                newLevel: result.initialLevel 
            });
        } catch (error) {
            logger.error('Error al reiniciar usuario:', error);
            res.status(500).json({ error: 'Error al reiniciar el progreso del usuario' });
        }
    }
}

module.exports = new UserController();
