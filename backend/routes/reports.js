const express = require('express');
const router = express.Router();

const logger = require('../config/logger');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const redisClient = require('../config/redis');

/**
 * Función para generar y cachear el reporte de cumplimiento en Redis
 * Se ejecuta periódicamente en segundo plano para no bloquear el API.
 */
const refreshReportsCache = async () => {
    try {
        if (!redisClient || !redisClient.isOpen) return null;

        logger.info('📊 Refrescando caché de reportes de cumplimiento...');

        // 0. Obtener total de módulos publicados una sola vez
        const [moduleData] = await db.query('SELECT COUNT(*) as total FROM modules WHERE is_published = TRUE');
        const totalModules = moduleData?.total || 1;

        // 1. Estadísticas Globales
        const [globalStats] = await db.query(`
            SELECT 
                COUNT(DISTINCT u.id) as total_staff,
                AVG(up_agg.completion_rate) as avg_completion_rate
            FROM users u
            LEFT JOIN (
                SELECT 
                    user_id, 
                    (COUNT(CASE WHEN status = 'completed' THEN 1 END) / ${totalModules}) * 100 as completion_rate
                FROM user_progress
                GROUP BY user_id
            ) up_agg ON u.id = up_agg.user_id
            WHERE u.is_active = TRUE AND u.role = 'student'
        `);

        // 2. Cumplimiento por Departamento
        const deptCompliance = await db.query(`
            SELECT 
                d.name as department,
                COUNT(u.id) as staff_count,
                SUM(CASE WHEN COALESCE(up_agg.completion_rate, 0) >= 100 THEN 1 ELSE 0 END) as completed_count,
                AVG(COALESCE(up_agg.completion_rate, 0)) as avg_completion
            FROM departments d
            LEFT JOIN users u ON u.department = d.name AND u.is_active = TRUE AND u.role = 'student'
            LEFT JOIN (
                SELECT 
                    user_id, 
                    (COUNT(DISTINCT module_id) / ${totalModules}) * 100 as completion_rate
                FROM user_progress
                WHERE status = 'completed'
                GROUP BY user_id
            ) up_agg ON u.id = up_agg.user_id
            GROUP BY d.name
            ORDER BY avg_completion DESC
        `);

        // 3. Usuarios en Riesgo (Menos del 20%)
        const usersAtRisk = await db.query(`
            SELECT 
                u.first_name, u.last_name, u.department, u.email,
                COALESCE(up_agg.completion_rate, 0) as progress
            FROM users u
            LEFT JOIN (
                SELECT 
                    user_id, 
                    (COUNT(DISTINCT module_id) / ${totalModules}) * 100 as completion_rate
                FROM user_progress
                WHERE status = 'completed'
                GROUP BY user_id
            ) up_agg ON u.id = up_agg.user_id
            WHERE u.is_active = TRUE AND u.role = 'student'
            HAVING progress < 20
            ORDER BY progress ASC
            LIMIT 50
        `);

        // 4. Listado Detallado (Limitado a 500 para el cache, el resto paginado si fuera necesario, pero aquí guardamos todo)
        const detailedUsers = await db.query(`
            SELECT 
                u.id, u.first_name, u.last_name, u.email, u.department, u.position,
                COALESCE(up_agg.completion_rate, 0) as progress,
                COALESCE(up_agg.completed_modules, 0) as completed_modules,
                ${totalModules} as total_modules
            FROM users u
            LEFT JOIN (
                SELECT 
                    user_id, 
                    COUNT(DISTINCT module_id) as completed_modules,
                    (COUNT(DISTINCT module_id) / ${totalModules}) * 100 as completion_rate
                FROM user_progress
                WHERE status = 'completed'
                GROUP BY user_id
            ) up_agg ON u.id = up_agg.user_id
            WHERE u.is_active = TRUE AND u.role = 'student'
            ORDER BY progress DESC
        `);

        const [certsCount] = await db.query('SELECT COUNT(*) as count FROM certificates');

        const reportData = {
            summary: {
                totalStaff: globalStats.total_staff,
                avgCompletion: Math.round(globalStats.avg_completion_rate || 0),
                totalCerts: certsCount.count,
                activeModules: totalModules
            },
            departments: deptCompliance.map(d => ({
                ...d,
                avg_completion: Math.round(d.avg_completion)
            })),
            atRisk: usersAtRisk,
            detailedUsers: detailedUsers.map(u => ({
                ...u,
                progress: Math.round(u.progress)
            })),
            lastUpdated: new Date()
        };

        // Guardar en Redis por 2 horas (7200 segundos)
        await redisClient.setEx('reports:compliance', 7200, JSON.stringify(reportData));
        logger.info('✅ Caché de reportes actualizada correctamente.');
        return reportData;
    } catch (error) {
        logger.error('❌ Error refrescando caché de reportes:', error);
        return null;
    }
};

// Programar actualización cada 2 horas (opcional: primera ejecución tras 30s)
setTimeout(refreshReportsCache, 30000);
setInterval(refreshReportsCache, 2 * 60 * 60 * 1000);

/**
 * @route   GET /api/reports/compliance
 * @desc    Obtener reporte de cumplimiento (Desde caché de Redis)
 * @access  Private/Admin
 */
router.get('/compliance', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        let reportData = null;

        // 1. Intentar obtener de Redis
        if (redisClient && redisClient.isOpen) {
            const cached = await redisClient.get('reports:compliance');
            if (cached) {
                reportData = JSON.parse(cached);
            }
        }

        // 2. Si no hay caché, generar en el momento (solo la primera vez)
        if (!reportData) {
            logger.info('⚠️ Caché de reportes vacía, generando en tiempo real (slow path)...');
            reportData = await refreshReportsCache();
        }

        if (!reportData) {
            return res.status(500).json({ error: 'No se pudieron generar los reportes.' });
        }

        res.json({
            success: true,
            ...reportData
        });
    } catch (error) {
        logger.error('Error obteniendo reportes:', error);
        res.status(500).json({ error: 'Error al cargar los reportes de cumplimiento' });
    }
});

module.exports = router;
