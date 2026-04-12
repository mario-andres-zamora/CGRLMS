const db = require('../config/database');
const redisClient = require('../config/redis');

async function forceSync() {
    try {
        console.log('Iniciando sincronización forzada...');
        
        // 1. Asegurar que Redis esté abierto
        if (!redisClient.isOpen) await redisClient.connect();

        // 2. Obtener puntos reales de DB
        const allPoints = await db.query('SELECT user_id, points FROM user_points WHERE points > 0');
        console.log(`Encontrados ${allPoints.length} usuarios con puntos.`);

        if (allPoints.length > 0) {
            const zSetData = allPoints.map(p => ({
                score: p.points,
                value: p.user_id.toString()
            }));
            await redisClient.del('leaderboard:points');
            await redisClient.zAdd('leaderboard:points', zSetData);
            console.log('ZSET de puntos actualizado en Redis.');
        }

        // 3. Invalidar caches de rutas
        const keys = await redisClient.keys('cache:/api/gamification/leaderboard*');
        const keys2 = await redisClient.keys('cache:/api/users/profile*');
        const allKeys = [...keys, ...keys2];
        if (allKeys.length > 0) {
            await redisClient.del(allKeys);
            console.log(`Limpiados ${allKeys.length} llaves de caché.`);
        }

        console.log('✅ Sincronización completada con éxito.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error en forceSync:', err);
        process.exit(1);
    }
}

forceSync();
