const express = require('express');
const router = express.Router();

const logger = require('../config/logger');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');
const { getLevels, refreshLeaderboardCache } = require('../utils/gamification');

const redisClient = require('../config/redis');

// Iniciar tarea en segundo plano al arrancar la app
setTimeout(refreshLeaderboardCache, 5000);
setInterval(refreshLeaderboardCache, 30 * 60 * 1000);

/**
 * @route   GET /api/gamification/leaderboard
 * @desc    Obtener el ranking global de funcionarios
 * @access  Private
 */
router.get('/leaderboard', authMiddleware, cacheMiddleware(60, true), async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin' && req.headers['x-view-as-student'] !== 'true';

        // 0. Get user basic info
        const [userBasic] = await db.query('SELECT email, department FROM users WHERE id = ?', [userId]);
        const email = userBasic?.email;
        const department = userBasic?.department;
        const userEmailLower = email ? email.toLowerCase() : '';

        let institutionalLeaderboard = [];
        let departmentRanking = [];

        // Tratar de obtener de Redis
        if (redisClient && redisClient.isOpen) {
            const cachedInst = await redisClient.get('leaderboard:institutional');
            const cachedDepts = await redisClient.get('leaderboard:departments');
            if (cachedInst && cachedDepts) {
                institutionalLeaderboard = JSON.parse(cachedInst);
                departmentRanking = JSON.parse(cachedDepts);
            }
        }

        // Fallback: Si Redis falló o estaba vacío, invocar la función sincrónicamente y esperar
        if (institutionalLeaderboard.length === 0) {
            await refreshLeaderboardCache();
            const cachedInst = await redisClient.get('leaderboard:institutional');
            const cachedDepts = await redisClient.get('leaderboard:departments');
            if (cachedInst) institutionalLeaderboard = JSON.parse(cachedInst);
            if (cachedDepts) departmentRanking = JSON.parse(cachedDepts);
        }

        // --- RANKING EN TIEMPO REAL DESDE REDIS (ZSET) ---
        let myRealTimeRank = null;
        if (redisClient && redisClient.isOpen) {
            // Redis devuelve índice 0-based, sumamos 1 para posición humana
            const rank = await redisClient.zRevRank('leaderboard:points', userId.toString());
            if (rank !== null) myRealTimeRank = rank + 1;
        }

        // Global Rank Position (Fallback o complemento con datos de DB)
        const userGlobalRankRaw = institutionalLeaderboard.find(r => r.email === userEmailLower);
        const myGlobalRankPos = myRealTimeRank || (userGlobalRankRaw ? userGlobalRankRaw.rank_position : (institutionalLeaderboard.length + 1));

        // Department Leaderboard
        let departmentLeaderboard = [];
        let myDeptRankPos = null;
        if (department) {
            departmentLeaderboard = institutionalLeaderboard
                .filter(r => r.department === department)
                .map((r, i) => ({ 
                    ...r, 
                    institutional_rank: r.rank_position, 
                    rank_position: i + 1 
                })); 
            const myEntry = departmentLeaderboard.find(r => r.email === userEmailLower);
            myDeptRankPos = myEntry ? myEntry.rank_position : null;
        }

        const [userPointsData] = await db.query('SELECT points, level FROM user_points WHERE user_id = ?', [userId]);

        res.json({
            success: true,
            currentUser: {
                userId,
                points: userPointsData?.points || 0,
                level: userPointsData?.level || 'Novato',
                globalRank: myGlobalRankPos,
                deptRank: myDeptRankPos,
                department
            },
            institutionalLeaderboard: institutionalLeaderboard,
            departmentLeaderboard,
            departmentRanking,
            scope: 'institutional'
        });
    } catch (error) {
        logger.error('Error obteniendo leaderboard:', error);
        res.status(500).json({ error: 'Error al cargar el ranking' });
    }
});

/**
 * @route   GET /api/gamification/settings
 * @desc    Obtener configuración de niveles y puntos
 * @access  Private/Admin
 */
router.get('/settings', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const levels = await getLevels(true);
        const settingsRaw = await db.query('SELECT setting_key, setting_value FROM system_settings');

        const settings = {};
        settingsRaw.forEach(s => {
            settings[s.setting_key] = s.setting_value;
        });

        res.json({
            success: true,
            levels
        });
    } catch (error) {
        logger.error('Error obteniendo settings de gamificación:', error);
        res.status(500).json({ error: 'Error al cargar configuración' });
    }
});

/**
 * @route   PUT /api/gamification/settings
 * @desc    Actualizar configuración de niveles y puntos
 * @access  Private/Admin
 */
router.put('/settings', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { levels, points } = req.body;

        // 1. Actualizar niveles if present
        if (levels && Array.isArray(levels)) {
            await db.query('DELETE FROM gamification_levels');
            for (const level of levels) {
                const minPoints = level.minPoints !== undefined ? level.minPoints : (level.min_points !== undefined ? level.min_points : 0);
                await db.query(
                    'INSERT INTO gamification_levels (name, min_points, icon) VALUES (?, ?, ?)',
                    [level.name || 'Nivel', minPoints, level.icon || 'Award']
                );
            }
            await getLevels(true); // Refrescar caché
        }

        // points removal handled here (nothing to do as we only process levels if present)

        res.json({ success: true, message: 'Configuración actualizada correctamente' });
    } catch (error) {
        logger.error('Error actualizando settings de gamificación:', error);
        res.status(500).json({ error: 'Error al actualizar configuración' });
    }
});

/**
 * @route   POST /api/gamification/leaderboard/refresh
 * @desc    Refrescar manualmente el caché del leaderboard (Admin)
 * @access  Private/Admin
 */
router.post('/leaderboard/refresh', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { clearCache } = require('../middleware/cache');
        
        // 1. Recalcular la data central
        await refreshLeaderboardCache();
        
        // 2. Invalidar todos los resultados cacheados por usuario del endpoint de leaderboard
        await clearCache('cache:/api/gamification/leaderboard*');
        
        res.json({ success: true, message: 'Ranking actualizado correctamente' });
    } catch (error) {
        logger.error('Error refrescando leaderboard manualmente:', error);
        res.status(500).json({ error: 'Error al actualizar el ranking' });
    }
});

module.exports = router;
