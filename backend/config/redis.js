const { createClient } = require('redis');
const logger = require('./logger');

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                logger.error('Redis: Máximo de reintentos alcanzado. Fallo crítico.');
                return new Error('Redis connection failed');
            }
            const delay = Math.min(retries * 500, 5000);
            logger.warn(`Redis: Error de conexión. Reintentando en ${delay}ms... (Intento ${retries})`);
            return delay;
        }
    },
    ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD })
});

redisClient.on('error', (err) => logger.error('Redis Client Error:', err.message));
redisClient.on('connect', () => logger.info('Redis Client Connected'));
redisClient.on('reconnecting', () => logger.info('Redis Client Reconnecting...'));

// Conectar Redis al cargar el módulo
(async () => {
    try {
        if (!redisClient.isOpen) {
            await redisClient.connect();
        }
    } catch (err) {
        logger.error('Error inicial de conexión a Redis:', err.message);
    }
})();

module.exports = redisClient;
