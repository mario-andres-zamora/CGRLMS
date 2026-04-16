const redisClient = require('./backend/config/redis');
const logger = require('./backend/config/logger');

async function clearDashboardCache() {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        const keys = await redisClient.keys('cache:/api/dashboard*');
        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`Cache cleared for ${keys.length} dashboard keys`);
        } else {
            console.log('No dashboard keys found in cache');
        }
        
        await redisClient.quit();
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

clearDashboardCache();
