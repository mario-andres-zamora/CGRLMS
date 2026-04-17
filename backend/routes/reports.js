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

        // 1. Estadísticas Globales (Directorio vs Registrados)
        const [globalStats] = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM staff_directory) as total_staff,
                COUNT(u.id) as registered_staff,
                SUM(COALESCE(up_agg.completion_rate, 0)) / GREATEST((SELECT COUNT(*) FROM staff_directory), 1) as avg_completion_rate,
                SUM(CASE WHEN up_agg.completion_rate = 100 THEN 1 ELSE 0 END) as completed_count
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
        `);

        // 2. Cumplimiento por Departamento (Incluyendo Directorio Maestro)
        const deptCompliance = await db.query(`
            SELECT 
                d.name as department,
                COALESCE(dir.total_pax, 0) as total_pax,
                COUNT(u.id) as registered_count,
                SUM(COALESCE(up_agg.completion_rate, 0)) / GREATEST(COALESCE(dir.total_pax, 0), 1) as real_compliance
            FROM departments d
            LEFT JOIN (
                SELECT department, COUNT(*) as total_pax 
                FROM staff_directory 
                GROUP BY department
            ) dir ON d.name = dir.department
            LEFT JOIN users u ON u.department = d.name AND u.is_active = TRUE AND u.role = 'student'
            LEFT JOIN (
                SELECT 
                    user_id, 
                    (COUNT(DISTINCT module_id) / ${totalModules}) * 100 as completion_rate
                FROM user_progress
                WHERE status = 'completed'
                GROUP BY user_id
            ) up_agg ON u.id = up_agg.user_id
            GROUP BY d.name, dir.total_pax
            ORDER BY real_compliance DESC
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

        // 4. Listado Detallado (con Insignias)
        const detailedUsers = await db.query(`
            SELECT 
                u.id, u.first_name, u.last_name, u.email, u.department, u.position,
                COALESCE(up_agg.completion_rate, 0) as progress,
                COALESCE(up_agg.completed_modules, 0) as completed_modules,
                ${totalModules} as total_modules,
                COALESCE((
                    SELECT JSON_ARRAYAGG(JSON_OBJECT('name', b.name, 'icon', b.icon_name))
                    FROM user_badges ub
                    JOIN badges b ON ub.badge_id = b.id
                    WHERE ub.user_id = u.id
                ), '[]') as badges
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

        // 5. Cumplimiento por Módulo (con tiempo promedio)
        const moduleCompliance = await db.query(`
            SELECT 
                m.id,
                m.title,
                m.order_index,
                (SELECT COUNT(*) FROM staff_directory) as total_students,
                COUNT(DISTINCT u.id) as completed_count,
                stats.avg_time
            FROM modules m
            LEFT JOIN user_progress up ON up.module_id = m.id AND up.status = 'completed'
            LEFT JOIN users u ON up.user_id = u.id AND u.role = 'student' AND u.is_active = TRUE
            LEFT JOIN (
                SELECT 
                    comp.reference_id,
                    AVG(TIMESTAMPDIFF(MINUTE, first_access.start_time, comp.created_at)) as avg_time
                FROM gamification_activities comp
                JOIN (
                    SELECT user_id, module_id, MIN(created_at) as start_time
                    FROM user_progress
                    GROUP BY user_id, module_id
                ) first_access ON first_access.user_id = comp.user_id AND first_access.module_id = comp.reference_id
                WHERE comp.activity_type = 'module_completed'
                GROUP BY comp.reference_id
            ) stats ON m.id = stats.reference_id
            WHERE m.is_published = TRUE
            GROUP BY m.id
            ORDER BY m.order_index DESC
        `);

        const [certsCount] = await db.query('SELECT COUNT(*) as count FROM certificates');

        const [pointsData] = await db.query('SELECT SUM(points) as total FROM user_points');
        const totalPoints = pointsData?.total || 0;

        // Conteo de usuarios en línea (Redis)
        let onlineUsers = 0;
        if (redisClient && redisClient.isOpen) {
            const keys = await redisClient.keys('online_user:*');
            onlineUsers = keys.length;
        }

        const reportData = {
            summary: {
                totalStaff: globalStats.total_staff || 0,
                registeredStaff: globalStats.registered_staff || 0,
                pendingRegistration: (globalStats.total_staff || 0) - (globalStats.registered_staff || 0),
                completed: Math.round(globalStats.completed_count || 0),
                inProgress: Math.max(0, (globalStats.registered_staff || 0) - (globalStats.completed_count || 0)),
                avgCompletion: Math.round(globalStats.avg_completion_rate || 0),
                onlineUsers: onlineUsers,
                totalPoints: totalPoints,
                avgPointsPerUser: globalStats.registered_staff > 0 ? Math.round(totalPoints / globalStats.registered_staff) : 0,
                totalCerts: certsCount.count || 0,
                activeModules: totalModules
            },
            departments: deptCompliance.map(d => ({
                department: d.department,
                total_pax: d.total_pax,
                registered_count: d.registered_count,
                avg_completion: Math.round(d.real_compliance || 0)
            })),
            moduleCompliance: moduleCompliance.map(m => ({
                ...m,
                avg_completion: m.total_students > 0
                    ? Math.round((m.completed_count / m.total_students) * 100)
                    : 0,
                avg_time: Math.round(m.avg_time || 0)
            })),
            atRisk: usersAtRisk,
            detailedUsers: detailedUsers.map(u => ({
                ...u,
                progress: Math.round(u.progress),
                badges: typeof u.badges === 'string' ? JSON.parse(u.badges) : u.badges
            })),
            lastUpdated: new Date()
        };

        // Guardar en Redis por 2 horas (7200 segundos)
        if (redisClient && redisClient.isOpen) {
            await redisClient.setEx('reports:compliance', 7200, JSON.stringify(reportData));
        }

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
 * @route   POST /api/reports/compliance/refresh
 * @desc    Forzar actualización del caché de reportes
 * @access  Private/Admin
 */
router.post('/compliance/refresh', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const reportData = await refreshReportsCache();
        if (!reportData) {
            return res.status(500).json({ error: 'Error al refrescar los reportes de cumplimiento' });
        }
        res.json({ success: true, message: 'Reportes actualizados correctamente', ...reportData });
    } catch (error) {
        logger.error('Error refreshing reports manually:', error);
        res.status(500).json({ error: 'Error al refrescar los reportes' });
    }
});

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

/**
 * @route   GET /api/reports/completion-trend
 * @desc    Obtener tendencia de finalizaciones por tiempo
 * @access  Private/Admin
 */
router.get('/completion-trend', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { module_id, interval = 'weekly', startDate, endDate } = req.query;

        if (!module_id) {
            return res.status(400).json({ error: 'ID de módulo es requerido' });
        }

        let dateFormat = '%Y-%m-%d';
        let groupBy = 'DATE(created_at)';

        if (interval === 'monthly') {
            dateFormat = '%b %Y';
            groupBy = 'DATE_FORMAT(created_at, "%Y-%m")';
        } else if (interval === 'weekly') {
            dateFormat = 'Semana %v, %Y';
            groupBy = 'YEARWEEK(created_at, 1)';
        } else if (interval === 'daily') {
            dateFormat = '%d %b';
            groupBy = 'DATE(created_at)';
        } else if (interval === 'yearly') {
            dateFormat = '%Y';
            groupBy = 'YEAR(created_at)';
        }

        let dateFilter = '';
        const params = [dateFormat, module_id];

        if (startDate && endDate) {
            dateFilter = ' AND created_at BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        const stats = await db.query(`
            SELECT 
                DATE_FORMAT(created_at, ?) as label,
                COUNT(*) as value,
                ${groupBy} as sort_key
            FROM gamification_activities
            WHERE activity_type = 'module_completed'
              AND reference_id = ? 
              ${dateFilter}
            GROUP BY sort_key
            ORDER BY sort_key ASC
            LIMIT 24
        `, params);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        logger.error('Error obteniendo tendencia de finalizacion:', error);
        res.status(500).json({ error: 'Error al cargar las estadísticas de tendencia' });
    }
});

/**
 * @route   GET /api/reports/department-compliance
 * @desc    Obtener cumplimiento por departamento para un módulo específico
 * @access  Private/Admin
 */
router.get('/department-compliance', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { module_id } = req.query;

        if (!module_id) {
            return res.status(400).json({ error: 'ID de módulo es requerido' });
        }

        const stats = await db.query(`
            SELECT 
                d.name as department,
                COALESCE(dir.total_pax, 0) as total_pax,
                COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN u.id END) as completed_count,
                ROUND((COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN u.id END) / GREATEST(COALESCE(dir.total_pax, 0), 1)) * 100) as avg_completion
            FROM departments d
            LEFT JOIN (
                SELECT department, COUNT(*) as total_pax 
                FROM staff_directory 
                GROUP BY department
            ) dir ON d.name = dir.department
            LEFT JOIN users u ON u.department = d.name AND u.is_active = TRUE AND u.role = 'student'
            LEFT JOIN user_progress up ON u.id = up.user_id AND up.module_id = ? AND up.status = 'completed'
            GROUP BY d.name, dir.total_pax
            ORDER BY avg_completion DESC
        `, [module_id]);

        res.json({ success: true, departments: stats });
    } catch (error) {
        console.error('Error en cumplimiento por departamento:', error);
        res.status(500).json({ error: 'Error al obtener datos de cumplimiento' });
    }
});

module.exports = router;
