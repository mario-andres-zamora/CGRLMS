require('dotenv').config();
const emailService = require('../services/emailService');
const logger = require('../config/logger');

async function test() {
    console.log('--- Iniciando Prueba de Email de Invitacion ---');
    try {
        await emailService.sendInvitationEmail(
            'mario.andres.zamora@cgr.go.cr', 
            'Mario Andres (Prueba)'
        );
        console.log('✅ Correo enviado correctamente. Revisa tu bandeja de entrada.');
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
    }
}

test();
