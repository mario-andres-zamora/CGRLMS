const moduleService = require('../services/moduleService');
const { clearCache } = require('../middleware/cache');
const logger = require('../config/logger');

class ModuleController {
    /**
     * @route   GET /api/modules
     * @desc    Obtener módulos
     */
    async getModules(req, res) {
        try {
            const isStudentView = req.headers['x-view-as-student'] === 'true' || req.headers['X-View-As-Student'] === 'true';
            const isAdmin = req.user.role === 'admin' && !isStudentView;
            const modules = await moduleService.getModulesWithProgress(req.user.id, isAdmin);
            res.json({ success: true, modules });
        } catch (error) {
            logger.error('Error obteniendo módulos:', error);
            res.status(500).json({ error: 'Error al obtener módulos' });
        }
    }

    /**
     * @route   GET /api/modules/admin/all
     * @desc    Obtener todos (Admin)
     */
    async getAllAdmin(req, res) {
        try {
            const modules = await moduleService.getAllModulesAdmin();
            res.json({ success: true, modules });
        } catch (error) {
            logger.error('Error obteniendo todos los módulos:', error);
            res.status(500).json({ error: 'Error al obtener módulos' });
        }
    }

    /**
     * @route   GET /api/modules/:id
     * @desc    Obtener detalle de un módulo
     */
    async getModuleById(req, res) {
        try {
            const moduleId = Number(req.params.id);
            const isStudentView = req.headers['x-view-as-student'] === 'true' || req.headers['X-View-As-Student'] === 'true';
            const isAdmin = req.user.role === 'admin' && !isStudentView;

            const moduleDetail = await moduleService.getModuleDetail(moduleId, req.user.id, isAdmin);
            if (!moduleDetail) {
                return res.status(404).json({ error: 'Módulo no encontrado' });
            }
            res.json({ success: true, module: moduleDetail });
        } catch (error) {
            logger.error('Error obteniendo módulo:', error);
            res.status(500).json({ error: 'Error al obtener módulo' });
        }
    }

    /**
     * @route   POST /api/modules
     * @desc    Crear módulo
     */
    async createModule(req, res) {
        try {
            const moduleId = await moduleService.createModule(req.body);
            
            // Limpiar caché después de la operación exitosa
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');
            await clearCache('cache:/api/reports*');

            res.status(201).json({
                success: true,
                message: 'Módulo creado correctamente',
                moduleId
            });
        } catch (error) {
            logger.error('Error creando módulo:', error);
            res.status(500).json({ error: 'Error al crear módulo' });
        }
    }

    /**
     * @route   PUT /api/modules/:id
     * @desc    Actualizar módulo
     */
    async updateModule(req, res) {
        try {
            const moduleId = req.params.id;
            await moduleService.updateModule(moduleId, req.body);

            // Limpiar caché después de la operación exitosa
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');
            await clearCache('cache:/api/reports*');

            res.json({ success: true, message: 'Módulo actualizado correctamente' });
        } catch (error) {
            logger.error('Error actualizando módulo:', error);
            res.status(500).json({ error: 'Error al actualizar módulo' });
        }
    }

    /**
     * @route   DELETE /api/modules/:id
     * @desc    Eliminar módulo
     */
    async deleteModule(req, res) {
        try {
            const moduleId = req.params.id;
            await moduleService.deleteModule(moduleId);

            // Limpiar caché después de la operación exitosa
            await clearCache('cache:/api/modules*');
            await clearCache('cache:/api/dashboard*');
            await clearCache('cache:/api/reports*');

            res.json({ success: true, message: 'Módulo eliminado correctamente' });
        } catch (error) {
            logger.error('Error eliminando módulo:', error);
            res.status(500).json({ error: 'Error al eliminar módulo' });
        }
    }
}

module.exports = new ModuleController();
