const db = require('../config/database');
const logger = require('../config/logger');

const initializeDatabase = async () => {
    try {
        logger.info('🔄 Verificando integridad de la base de datos...');

        // Crear tabla user_content_progress si no existe
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_content_progress (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                content_id INT NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                response_data JSON COMMENT 'Almacena respuestas de interactivos dentro de lecciones',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (content_id) REFERENCES lesson_contents(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_content (user_id, content_id),
                INDEX idx_user_id (user_id),
                INDEX idx_content_id (content_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        // Migración: Añadir response_data si la tabla ya existía sin ella
        const [columns] = await db.query("SHOW COLUMNS FROM user_content_progress LIKE 'response_data'");
        if (columns.length === 0) {
            logger.info('➕ Añadiendo columna missing response_data a user_content_progress...');
            await db.query("ALTER TABLE user_content_progress ADD COLUMN response_data JSON AFTER completed_at");
        }


        // Crear tablas de encuestas si no existen
        await db.query(`
            CREATE TABLE IF NOT EXISTS surveys (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                module_id INT,
                lesson_id INT,
                points INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE SET NULL,
                FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE SET NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS survey_questions (
                id INT PRIMARY KEY AUTO_INCREMENT,
                survey_id INT NOT NULL,
                question_text TEXT NOT NULL,
                question_type ENUM('multiple_choice', 'rating', 'text') DEFAULT 'multiple_choice',
                order_index INT DEFAULT 0,
                is_required BOOLEAN DEFAULT TRUE,
                FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS survey_options (
                id INT PRIMARY KEY AUTO_INCREMENT,
                question_id INT NOT NULL,
                option_text VARCHAR(255) NOT NULL,
                order_index INT DEFAULT 0,
                FOREIGN KEY (question_id) REFERENCES survey_questions(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS survey_responses (
                id INT PRIMARY KEY AUTO_INCREMENT,
                survey_id INT NOT NULL,
                user_id INT NOT NULL,
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS survey_answers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                response_id INT NOT NULL,
                question_id INT NOT NULL,
                answer_text TEXT,
                option_id INT,
                FOREIGN KEY (response_id) REFERENCES survey_responses(id) ON DELETE CASCADE,
                FOREIGN KEY (question_id) REFERENCES survey_questions(id) ON DELETE CASCADE,
                FOREIGN KEY (option_id) REFERENCES survey_options(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);

        logger.info('✅ Estructura de base de datos verificada y actualizada.');
    } catch (error) {
        logger.error('❌ Error inicializando base de datos:', error);
        // No salimos del proceso para permitir que la app intente funcionar, 
        // pero el error queda registrado.
    }
};

module.exports = { initializeDatabase };
