const db = require('../config/database');
const logger = require('../config/logger');

class ModuleService {
    /**
     * Obtiene todos los módulos con cálculo de progreso para el usuario
     */
    async getModulesWithProgress(userId, isAdmin) {
        const modules = await db.query(
            `SELECT 
                m.*,
                COUNT(DISTINCT l.id) as total_lessons,
                (SELECT COUNT(*) FROM quizzes q WHERE q.module_id = m.id AND q.is_published = TRUE AND q.lesson_id IS NULL) as total_quizzes,
                (SELECT COUNT(*) FROM surveys s WHERE s.module_id = m.id AND s.lesson_id IS NULL) as total_surveys,
                SUM(l.duration_minutes) as total_duration,
                (SELECT IFNULL(SUM(lc.points), 0) 
                 FROM lesson_contents lc 
                 JOIN lessons l2 ON lc.lesson_id = l2.id 
                 WHERE l2.module_id = m.id AND l2.is_optional = FALSE 
                 ${isAdmin ? '' : 'AND l2.is_published = TRUE'}) as points_to_earn
            FROM modules m
            LEFT JOIN lessons l ON m.id = l.module_id 
                AND l.is_optional = FALSE
                ${isAdmin ? '' : 'AND l.is_published = TRUE'}
            WHERE 1=1 ${isAdmin ? '' : 'AND m.is_published = 1'}
            GROUP BY m.id
            ORDER BY m.order_index ASC`
        );

        let lastModuleCompleted = true;
        let previousModuleTitle = "";

        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];

            const [lessonProgress] = await db.query(
                `SELECT COUNT(*) as completed_count FROM user_progress WHERE user_id = ? AND module_id = ? AND status = 'completed'`,
                [userId, module.id]
            );

            const [quizProgress] = await db.query(
                `SELECT COUNT(DISTINCT quiz_id) as passed_count FROM quiz_attempts WHERE user_id = ? AND passed = TRUE AND quiz_id IN (SELECT id FROM quizzes WHERE module_id = ? AND is_published = TRUE)`,
                [userId, module.id]
            );

            const [surveyProgress] = await db.query(
                `SELECT COUNT(DISTINCT survey_id) as completed_count FROM survey_responses WHERE user_id = ? AND survey_id IN (SELECT id FROM surveys WHERE module_id = ? AND lesson_id IS NULL)`,
                [userId, module.id]
            );

            const totalLessons = module.total_lessons || 0;
            const totalQuizzes = module.total_quizzes || 0;
            const totalSurveys = module.total_surveys || 0;
            const totalItems = totalLessons + totalQuizzes + totalSurveys;

            const completedLessons = lessonProgress.completed_count || 0;
            const completedQuizzes = quizProgress.passed_count || 0;
            const completedSurveys = surveyProgress.completed_count || 0;
            const completedItems = completedLessons + completedQuizzes + completedSurveys;

            module.completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            if (module.completionPercentage > 100) module.completionPercentage = 100;

            module.is_locked = false;
            module.lock_reason = null;
            if (module.requires_previous && !lastModuleCompleted && !isAdmin) {
                module.is_locked = true;
                module.lock_reason = `Completa el módulo "${previousModuleTitle}"`;
            }

            lastModuleCompleted = module.completionPercentage === 100;
            previousModuleTitle = module.title;

            module.userProgress = {
                completed_lessons: completedLessons,
                completed_quizzes: completedQuizzes,
                total_items: totalItems
            };
        }

        return modules;
    }

    /**
     * Obtiene todos los módulos para administración
     */
    async getAllModulesAdmin() {
        return await db.query(
            `SELECT 
                m.*,
                COUNT(DISTINCT l.id) as total_lessons,
                SUM(l.duration_minutes) as total_duration
            FROM modules m
            LEFT JOIN lessons l ON m.id = l.module_id AND l.is_optional = FALSE
            GROUP BY m.id
            ORDER BY m.order_index ASC`
        );
    }

    /**
     * Obtiene un módulo con todo su contenido y progreso del usuario
     */
    async getModuleDetail(moduleId, userId, isAdmin) {
        const [module] = await db.query(
            `SELECT m.*,
                (SELECT IFNULL(SUM(lc.points), 0) FROM lesson_contents lc JOIN lessons l2 ON lc.lesson_id = l2.id WHERE l2.module_id = m.id AND l2.is_optional = FALSE ${isAdmin ? '' : 'AND l2.is_published = TRUE'}) as points_to_earn
             FROM modules m WHERE m.id = ? ${isAdmin ? '' : 'AND m.is_published = 1'}`,
            [moduleId]
        );

        if (!module) return null;

        // Lockdown logic
        if (module.requires_previous && !isAdmin) {
            const [prevModule] = await db.query(
                `SELECT id, order_index FROM modules WHERE order_index < ? AND is_published = TRUE ORDER BY order_index DESC LIMIT 1`,
                [module.order_index]
            );

            if (prevModule) {
                const [lessonProgress] = await db.query(`SELECT COUNT(*) as completed_count FROM user_progress WHERE user_id = ? AND module_id = ? AND status = 'completed'`, [userId, prevModule.id]);
                const [totalRequired] = await db.query(`SELECT COUNT(*) as total FROM lessons WHERE module_id = ? AND is_optional = FALSE AND is_published = TRUE`, [prevModule.id]);
                const [quizProgress] = await db.query(`SELECT COUNT(DISTINCT quiz_id) as passed_count FROM quiz_attempts WHERE user_id = ? AND passed = TRUE AND quiz_id IN (SELECT id FROM quizzes WHERE module_id = ? AND is_published = TRUE)`, [userId, prevModule.id]);
                const [totalQuizzes] = await db.query(`SELECT COUNT(*) as total FROM quizzes WHERE module_id = ? AND is_published = TRUE`, [prevModule.id]);

                const isCompleted = (lessonProgress.completed_count >= totalRequired.total) && (quizProgress.passed_count >= totalQuizzes.total);
                if (!isCompleted) {
                    module.is_locked = true;
                    module.lock_message = 'Debes completar el módulo anterior antes de acceder a este.';
                }
            }
        }

        const lessons = await db.query(
            `SELECT l.*, up.status, up.progress_percentage, up.time_spent_minutes, up.completed_at, (SELECT SUM(points) FROM lesson_contents WHERE lesson_id = l.id) as total_points
             FROM lessons l LEFT JOIN user_progress up ON l.id = up.lesson_id AND up.user_id = ?
             WHERE l.module_id = ? ${isAdmin ? '' : 'AND l.is_published = TRUE'} ORDER BY l.order_index ASC`,
            [userId, moduleId]
        );

        const resources = await db.query('SELECT * FROM resources WHERE module_id = ? ORDER BY id ASC', [moduleId]);
        const quizzes = await db.query(
            `SELECT q.*, (SELECT COUNT(*) FROM quiz_attempts WHERE quiz_id = q.id AND user_id = ?) as attempts_count, (SELECT MAX(score) FROM quiz_attempts WHERE quiz_id = q.id AND user_id = ?) as best_score
             FROM quizzes q WHERE q.module_id = ? ${isAdmin ? '' : 'AND q.is_published = TRUE'}`,
            [userId, userId, moduleId]
        );

        const surveys = await db.query(
            `SELECT s.*, (SELECT COUNT(*) FROM survey_responses WHERE survey_id = s.id AND user_id = ?) as is_completed FROM surveys s WHERE s.module_id = ?`,
            [userId, moduleId]
        );

        const requiredLessons = lessons.filter(l => !l.is_optional);
        const completedRequiredLessons = requiredLessons.filter(l => l.status === 'completed').length;
        const standaloneQuizzes = quizzes.filter(q => !q.lesson_id);
        const completedStandaloneQuizzes = standaloneQuizzes.filter(q => q.best_score >= q.passing_score).length;
        const standaloneSurveys = surveys.filter(s => !s.lesson_id);
        const completedStandaloneSurveys = standaloneSurveys.filter(s => s.is_completed > 0).length;

        const totalItems = requiredLessons.length + standaloneQuizzes.length + standaloneSurveys.length;
        const totalCompleted = completedRequiredLessons + completedStandaloneQuizzes + completedStandaloneSurveys;
        const completionPercentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

        return {
            ...module,
            completionPercentage,
            lessons,
            resources,
            quizzes,
            surveys: surveys.map(s => ({ ...s, isCompleted: s.is_completed > 0 }))
        };
    }

    /**
     * Crea un módulo
     */
    async createModule(data) {
        const {
            module_number, title, description, month, duration_minutes,
            is_published, generates_certificate, requires_previous, release_date, order_index, image_url
        } = data;

        const formattedDate = release_date ? new Date(release_date).toISOString().slice(0, 19).replace('T', ' ') : null;

        const result = await db.query(
            `INSERT INTO modules (module_number, title, description, month, duration_minutes, is_published, generates_certificate, requires_previous, release_date, order_index, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [module_number, title, description, month, duration_minutes, is_published, generates_certificate, requires_previous, formattedDate, order_index, image_url]
        );
        return result.insertId;
    }

    /**
     * Actualiza un módulo
     */
    async updateModule(moduleId, data) {
        const {
            module_number, title, description, month, duration_minutes,
            is_published, generates_certificate, requires_previous, release_date, order_index, image_url
        } = data;

        const formattedDate = release_date ? new Date(release_date).toISOString().slice(0, 19).replace('T', ' ') : null;

        await db.query(
            `UPDATE modules SET module_number = ?, title = ?, description = ?, month = ?, duration_minutes = ?, is_published = ?, generates_certificate = ?, requires_previous = ?, release_date = ?, order_index = ?, image_url = ?
             WHERE id = ?`,
            [module_number, title, description, month, duration_minutes, is_published, generates_certificate, requires_previous, formattedDate, order_index, image_url, moduleId]
        );
    }

    /**
     * Elimina un módulo
     */
    async deleteModule(moduleId) {
        await db.query('DELETE FROM modules WHERE id = ?', [moduleId]);
    }
}

module.exports = new ModuleService();
