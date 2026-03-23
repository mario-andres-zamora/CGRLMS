const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const db = require('../config/database');
const logger = require('../config/logger');

async function migrateIndexes() {
    try {
        logger.info('🚀 Iniciando optimización de índices de base de datos...');

        // 1. users: UNIQUE INDEX on email (si no existe) e INDEX on department
        try {
            await db.query('ALTER TABLE users ADD UNIQUE INDEX idx_users_email (email)');
            logger.info('✅ Índice único añadido: users(email)');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') logger.info('ℹ️  El índice idx_users_email ya existe.');
            else throw e;
        }

        try {
            await db.query('ALTER TABLE users ADD INDEX idx_users_department (department)');
            logger.info('✅ Índice añadido: users(department)');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') logger.info('ℹ️  El índice idx_users_department ya existe.');
            else throw e;
        }

        // 2. staff_directory: INDEX on department
        try {
            await db.query('ALTER TABLE staff_directory ADD INDEX idx_staff_department (department)');
            logger.info('✅ Índice añadido: staff_directory(department)');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') logger.info('ℹ️  El índice idx_staff_department ya existe.');
            else throw e;
        }

        // 3. user_progress: INDEX compuesto (user_id, module_id) y solo status
        try {
            await db.query('ALTER TABLE user_progress ADD INDEX idx_progress_user_module (user_id, module_id)');
            logger.info('✅ Índice compuesto añadido: user_progress(user_id, module_id)');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') logger.info('ℹ️  El índice idx_progress_user_module ya existe.');
            else throw e;
        }

        try {
            await db.query('ALTER TABLE user_progress ADD INDEX idx_progress_status (status)');
            logger.info('✅ Índice añadido: user_progress(status)');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') logger.info('ℹ️  El índice idx_progress_status ya existe.');
            else throw e;
        }

        // 4. user_points: INDEX on user_id (para joins rápidos en el leaderboard)
        try {
            await db.query('ALTER TABLE user_points ADD INDEX idx_points_user (user_id)');
            logger.info('✅ Índice añadido: user_points(user_id)');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') logger.info('ℹ️  El índice idx_points_user ya existe.');
            else throw e;
        }

        logger.info('🎊 Optimización de índices completada exitosamente.');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error fatal durante la migración de índices:', error);
        process.exit(1);
    }
}

migrateIndexes();
