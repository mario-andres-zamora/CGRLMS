const express = require('express');
const router = express.Router();

const logger = require('../config/logger');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');
const badgeService = require('../services/badgeService');

router.get('/', authMiddleware, cacheMiddleware(300, true), async (req, res) => {
    try {
        const userId = req.user.id;
        const isStudentView = req.headers['x-view-as-student'] === 'true' || req.headers['X-View-As-Student'] === 'true';
        const isAdmin = req.user.role === 'admin' && !isStudentView;

        // 1. Obtener todos los módulos (Admins ven todos, estudiantes ven los publicados incluyendo futuros)
        const modules = await db.query(
            `SELECT m.id, m.title, m.order_index, m.requires_previous, m.release_date
             FROM modules m
             WHERE 1=1 ${isAdmin ? '' : 'AND m.is_published = 1'}
             ORDER BY m.order_index ASC`
        );

        let completedModulesCount = 0;
        let totalMandatoryItemsGlobally = 0;
        let completedMandatoryItemsGlobally = 0;
        const totalModulesCount = modules.length;
        const modulesWithProgress = [];

        let lastModuleCompleted = true;
        let previousModuleTitle = "";

        for (const m of modules) {
            // Contar lecciones totales (SOLO OBLIGATORIAS) y completadas (SOLO OBLIGATORIAS)
            const [lessonsData] = await db.query(
                `SELECT 
                    COUNT(CASE WHEN l.is_optional = FALSE THEN 1 END) as total,
                    COUNT(CASE WHEN up.status = 'completed' AND l.is_optional = FALSE THEN 1 END) as completed
                 FROM lessons l
                 LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
                 WHERE l.module_id = ? ${isAdmin ? '' : 'AND l.is_published = TRUE'}`,
                [userId, m.id]
            );

            // Contar quizzes totales y aprobados (SOLO INDEPENDIENTES)
            const [quizzesData] = await db.query(
                `SELECT 
                    COUNT(*) as total,
                    (SELECT COUNT(DISTINCT quiz_id) FROM quiz_attempts qa 
                     WHERE qa.user_id = ? AND qa.passed = TRUE 
                     AND qa.quiz_id IN (SELECT id FROM quizzes WHERE module_id = ? ${isAdmin ? '' : 'AND is_published = TRUE'} AND lesson_id IS NULL)) as completed
                 FROM quizzes q
                 WHERE q.module_id = ? ${isAdmin ? '' : 'AND q.is_published = TRUE'} AND q.lesson_id IS NULL`,
                [userId, m.id, m.id]
            );

            const totalItems = (lessonsData.total || 0) + (quizzesData.total || 0);
            const completedItems = (lessonsData.completed || 0) + (quizzesData.completed || 0);

            totalMandatoryItemsGlobally += totalItems;
            completedMandatoryItemsGlobally += completedItems;

            const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            const isFullyCompleted = totalItems > 0 && completedItems === totalItems;

            if (isFullyCompleted) completedModulesCount++;

            // Determinar si está bloqueado
            let isLocked = false;
            let lockReason = null;
            let isUpcoming = false;

            const releaseDate = m.release_date ? new Date(m.release_date) : null;
            if (releaseDate && releaseDate > new Date() && !isAdmin) {
                isLocked = true;
                isUpcoming = true;
                lockReason = "Próximamente";
            } else if (m.requires_previous && !lastModuleCompleted && !isAdmin) {
                isLocked = true;
                lockReason = `Complete el módulo "${previousModuleTitle}"`;
            }

            // Determinar siguiente lección
            const [nextLesson] = await db.query(
                `SELECT l.id FROM lessons l
                 LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
                 WHERE l.module_id = ? AND l.is_published = TRUE 
                 AND (up.status IS NULL OR up.status != 'completed')
                 ORDER BY l.order_index ASC LIMIT 1`,
                [userId, m.id]
            );

            modulesWithProgress.push({
                id: m.id,
                title: m.title,
                order_index: m.order_index,
                progress: progress,
                status: isFullyCompleted ? 'completed' : (completedItems > 0 ? 'in_progress' : 'not_started'),
                next_lesson_id: nextLesson?.id || null,
                is_locked: isLocked,
                is_upcoming: isUpcoming,
                lock_reason: lockReason
            });

            // Para el siguiente módulo en la iteración
            lastModuleCompleted = isFullyCompleted;
            previousModuleTitle = m.title;
        }

        // 2. Obtener puntos y nivel del usuario
        const [userPoints] = await db.query(
            `SELECT points, level FROM user_points WHERE user_id = ?`,
            [userId]
        );

        // 3. Obtener insignias del usuario
        const userBadges = await badgeService.getUserBadges(userId);

        // 3. Rankings using Redis (Faster & Safer)
        const [userData] = await db.query(`SELECT email, department FROM users WHERE id = ?`, [userId]);
        const email = userData?.email;
        const dept = userData?.department;
        const userEmailLower = (email || '').toLowerCase();

        const redisClient = require('../config/redis');
        let institutionalRank = null;
        let departmentalRank = null;
        let totalUsersCount = 0;
        let totalInDepartment = 0;

        if (redisClient && redisClient.isOpen) {
            try {
                // 1. User Global Rank (Real-time ZSET)
                const zRank = await redisClient.zRevRank('leaderboard:points', userId.toString());

                // 2. Institutional cache for total count and dept ranking
                const cachedInst = await redisClient.get('leaderboard:institutional');
                if (cachedInst) {
                    const institutionalLeaderboard = JSON.parse(cachedInst);
                    totalUsersCount = institutionalLeaderboard.length;

                    if (zRank !== null) {
                        institutionalRank = zRank + 1;
                    } else {
                        const userEntry = institutionalLeaderboard.find(r => (r.email || '').toLowerCase() === userEmailLower);
                        institutionalRank = userEntry ? userEntry.rank_position : (totalUsersCount + 1);
                    }

                    if (dept) {
                        const deptUsers = institutionalLeaderboard.filter(r => r.department === dept);
                        totalInDepartment = deptUsers.length;
                        const myDeptIndex = deptUsers.findIndex(r => (r.email || '').toLowerCase() === userEmailLower);
                        departmentalRank = myDeptIndex !== -1 ? myDeptIndex + 1 : null;
                    }
                }
            } catch (redisError) {
                logger.error('Redis error in dashboard ranking:', redisError);
            }
        }

        // Fallback to Database
        if (institutionalRank === null) {
            const globalRanking = await db.query(
                `SELECT LOWER(sd.email) as email, RANK() OVER (ORDER BY COALESCE(up.points, -1) DESC, sd.full_name ASC) as pos
                 FROM staff_directory sd
                 LEFT JOIN users u ON sd.email = u.email
                 LEFT JOIN user_points up ON u.id = up.user_id`
            );
            const userGlobalRankRaw = globalRanking.find(r => (r.email || '').toLowerCase() === userEmailLower);
            institutionalRank = userGlobalRankRaw ? userGlobalRankRaw.pos : (globalRanking.length + 1);
            totalUsersCount = globalRanking.length;

            if (dept) {
                const deptRanking = await db.query(
                    `SELECT LOWER(sd.email) as email, RANK() OVER (ORDER BY COALESCE(up.points, -1) DESC, sd.full_name ASC) as pos
                     FROM staff_directory sd
                     LEFT JOIN users u ON sd.email = u.email
                     LEFT JOIN user_points up ON u.id = up.user_id
                     WHERE sd.department = ?`,
                    [dept]
                );
                const userDeptRankRaw = deptRanking.find(r => (r.email || '').toLowerCase() === userEmailLower);
                departmentalRank = userDeptRankRaw ? userDeptRankRaw.pos : null;
                totalInDepartment = deptRanking.length;
            }
        }

        const stats = {
            completedModules: completedModulesCount,
            totalModules: totalModulesCount,
            points: userPoints?.points || 0,
            level: userPoints?.level || 'Novato',
            rank: institutionalRank,
            departmentRank: departmentalRank,
            totalInDepartment,
            totalUsers: totalUsersCount,
            badges: userBadges || [],
            completionPercentage: totalMandatoryItemsGlobally > 0
                ? Math.round((completedMandatoryItemsGlobally / totalMandatoryItemsGlobally) * 100)
                : 0
        };

        res.json({
            success: true,
            stats,
            modules: modulesWithProgress
        });
    } catch (error) {
        logger.error('Error en dashboard:', error);
        res.status(500).json({ error: 'Error al cargar datos del dashboard' });
    }
});

/**
 * @route   GET /api/dashboard/admin-stats
 * @desc    Obtener estadísticas globales para el panel de administración
 * @access  Private/Admin
 */
router.get('/admin-stats', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const [userStats] = await db.query('SELECT COUNT(*) as count FROM users');
        const [activeUserStats] = await db.query('SELECT COUNT(*) as count FROM users WHERE is_active = TRUE');
        const [moduleStats] = await db.query('SELECT COUNT(*) as count FROM modules');

        // Mejor enfoque: Parallel queries
        const stats = {
            users: userStats?.count || 0,
            activeUsers: activeUserStats?.count || 0,
            modules: moduleStats?.count || 0,
            campaigns: 0
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        logger.error('Error in admin stats:', error);
        res.status(500).json({ error: 'Error al cargar estadísticas de admin' });
    }
});

module.exports = router;
