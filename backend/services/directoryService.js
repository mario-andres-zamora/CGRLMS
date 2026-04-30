const db = require('../config/database');
const logger = require('../config/logger');

class DirectoryService {
    async getFullDirectory() {
        return await db.query(
            `SELECT sd.*, 
                    CASE WHEN u.id IS NOT NULL THEN TRUE ELSE FALSE END as is_registered,
                    u.last_login
             FROM staff_directory sd
             LEFT JOIN users u ON sd.email = u.email COLLATE utf8mb4_unicode_ci
             ORDER BY sd.department ASC, sd.full_name ASC`
        );
    }

    async addSingleRecord(data) {
        const { email, full_name, department, position } = data;
        if (!email || !full_name) throw new Error('Email y nombre son requeridos');

        return await db.query(
            `INSERT INTO staff_directory (email, full_name, department, position) 
             VALUES (?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE full_name = ?, department = ?, position = ?`,
            [email, full_name, department, position, full_name, department, position]
        );
    }

    async updateRecord(id, data) {
        const { email, full_name, department, position } = data;
        return await db.query(
            'UPDATE staff_directory SET email = ?, full_name = ?, department = ?, position = ? WHERE id = ?',
            [email, full_name, department, position, id]
        );
    }

    async deleteRecord(id) {
        return await db.query('DELETE FROM staff_directory WHERE id = ?', [id]);
    }

    async processCSV(fileBuffer) {
        const csvContent = fileBuffer.toString('utf8');
        const lines = csvContent.split(/\r?\n/);
        const startIndex = (lines[0] && lines[0].toLowerCase().includes('email')) ? 1 : 0;

        let processed = 0;
        let errors = 0;

        for (let i = startIndex; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const [email, fullName, department, position] = line.split(',').map(s => s.trim());

            if (email && fullName) {
                try {
                    await db.query(
                        `INSERT INTO staff_directory (email, full_name, department, position) 
                         VALUES (?, ?, ?, ?) 
                         ON DUPLICATE KEY UPDATE full_name = ?, department = ?, position = ?`,
                        [email, fullName, department, position, fullName, department, position]
                    );

                    // Sync related user if exists
                    await db.query(
                        'UPDATE users SET department = ?, position = ? WHERE email = ?',
                        [department, position || '', email]
                    );

                    processed++;
                } catch (e) {
                    logger.error(`Error processing line ${i}:`, e);
                    errors++;
                }
            }
        }

        return { processed, errors };
    }

    getCSVTemplate() {
        return 'email,full_name,department,position\nfuncionario@cgr.go.cr,Nombre Completo,TI,Especialista en Seguridad';
    }
}

module.exports = new DirectoryService();
