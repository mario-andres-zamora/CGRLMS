require('dotenv').config();
const emailService = require('../services/emailService');

async function test() {
    console.log('--- Iniciando Prueba de Email de Insignia ---');
    try {
        const mockBadge = {
            name: 'Anomalía del Sistema II. +50pts',
            description: 'Has encontrado un fallo en la Matrix que no debería existir. Al reportarlo, has demostrado que tu percepción va más allá de lo que la Matrix intenta mostrarte y has mejorado la plataforma.',
            image_url: 'bienvenida-seguridad.svg' // Usamos la de bienvenida para la prueba
        };

        await emailService.sendBadgeNotification(
            'yanio.zuniga@cgr.go.cr',
            'Yanio',
            mockBadge
        );
        console.log('✅ Correo de insignia enviado correctamente.');
    } catch (error) {
        console.error('❌ Error en la prueba:', error);
    }
}

test();
