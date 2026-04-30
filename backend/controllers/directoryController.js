const directoryService = require('../services/directoryService');
const logger = require('../config/logger');

class DirectoryController {
    async getFullDirectory(req, res) {
        try {
            const directory = await directoryService.getFullDirectory();
            res.json({ success: true, directory });
        } catch (error) {
            logger.error('Error obteniendo directorio:', error);
            res.status(500).json({ error: 'Error al obtener el directorio maestro' });
        }
    }

    async addSingleRecord(req, res) {
        try {
            const { email, full_name, department, position } = req.body;
            if (!email || !full_name) {
                return res.status(400).json({ error: 'Email y nombre son requeridos' });
            }

            await directoryService.addSingleRecord(req.body);
            res.status(201).json({ success: true, message: 'Funcionario agregado correctamente' });
        } catch (error) {
            logger.error('Error agregando funcionario individual:', error);
            res.status(500).json({ error: 'Error al agregar el funcionario' });
        }
    }

    async uploadCSV(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ningún archivo' });
        }

        try {
            const { processed, errors } = await directoryService.processCSV(req.file.buffer);
            res.json({
                success: true,
                message: `Proceso completado: ${processed} funcionarios sincronizados.`,
                errors
            });
        } catch (error) {
            logger.error('Error procesando CSV:', error);
            res.status(500).json({ error: 'Error al procesar el archivo CSV' });
        }
    }

    async updateRecord(req, res) {
        try {
            const { id } = req.params;
            await directoryService.updateRecord(id, req.body);
            res.json({ success: true, message: 'Registro actualizado correctamente' });
        } catch (error) {
            logger.error('Error actualizando registro del directorio:', error);
            res.status(500).json({ error: 'Error al actualizar el registro' });
        }
    }

    async deleteRecord(req, res) {
        try {
            const { id } = req.params;
            await directoryService.deleteRecord(id);
            res.json({ success: true, message: 'Registro eliminado del directorio' });
        } catch (error) {
            logger.error('Error al eliminar registro del directorio:', error);
            res.status(500).json({ error: 'Error al eliminar el registro' });
        }
    }

    getTemplate(req, res) {
        const csvContent = directoryService.getCSVTemplate();
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=plantilla_directorio_cgr.csv');
        res.status(200).send(csvContent);
    }

    async sendInvitation(req, res) {
        try {
            const { email, full_name } = req.body;
            if (!email || !full_name) {
                return res.status(400).json({ error: 'Email y nombre son requeridos' });
            }
            const emailService = require('../services/emailService');
            await emailService.sendInvitationEmail(email, full_name);
            res.json({ success: true, message: `Invitación enviada correctamente a ${full_name}` });
        } catch (error) {
            logger.error('Error enviando invitación individual:', error);
            res.status(500).json({ error: 'Error al enviar la invitación' });
        }
    }
}

module.exports = new DirectoryController();
