const nodemailer = require('nodemailer');
const logger = require('../config/logger');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: false, // true para 465, false para otros
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            tls: {
                // Requerido para Gmail y otros servicios modernos
                rejectUnauthorized: false
            }
        });

        // Verificar conexión al inicio
        this.transporter.verify((error, success) => {
            if (error) {
                logger.error('Error en conexión SMTP:', error);
            } else {
                logger.info('Servidor de correo listo para enviar mensajes');
            }
        });
    }

    /**
     * Envía un correo electrónico cuando un usuario gana una insignia
     */
    async sendBadgeNotification(userEmail, userName, badge) {
        const path = require('path');
        const fs = require('fs');

        // Buscamos las imágenes en la nueva carpeta interna del backend
        const assetsPath = path.resolve(__dirname, '../assets/images');

        // Priorizamos la versión PNG para el correo (mejor compatibilidad)
        const badgeImageName = badge.image_url ? badge.image_url.replace('.svg', '.png') : 'bienvenida-seguridad.png';
        let badgePath = path.join(assetsPath, 'badges', badgeImageName);

        // Fallback al SVG si por alguna razón no existe el PNG
        if (!fs.existsSync(badgePath)) {
            badgePath = path.join(assetsPath, 'badges', badge.image_url || 'bienvenida-seguridad.svg');
        }

        // Segundo fallback si la imagen no existe físicamente en absoluto
        if (!fs.existsSync(badgePath)) {
            badgePath = path.join(assetsPath, 'shield.svg');
        }

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #04060b; margin: 0; padding: 0; color: #ffffff; }
                .container { max-width: 600px; margin: 20px auto; background-color: #0b0f1c; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
                .header { background-color: #0d111d; padding: 40px 20px; text-align: center; border-bottom: 2px solid #EF8843; }
                .logo-institucional { width: 120px; margin-bottom: 20px; }
                .content { padding: 40px; text-align: center; }
                .badge-container { margin: 30px auto; width: 200px; height: 200px; background-color: #111627; border-radius: 40px; border: 1px solid rgba(255,255,255,0.1); text-align: center; line-height: 200px; box-shadow: 0 15px 30px rgba(0,0,0,0.3); }
                .badge-image { width: 140px; height: 140px; vertical-align: middle; object-fit: contain; }
                .congrats { color: #EF8843; text-transform: uppercase; font-weight: 900; letter-spacing: 2px; font-size: 14px; margin-bottom: 10px; }
                h1 { font-size: 26px; margin: 0 0 15px 0; font-weight: 800; letter-spacing: -0.5px; color: #ffffff; }
                p { color: #94a3b8; line-height: 1.6; font-size: 15px; }
                .badge-name { color: #ffffff; font-weight: 700; font-size: 22px; margin: 20px 0 5px 0; }
                .badge-desc { color: #64748b; font-size: 14px; font-style: italic; margin-bottom: 35px; max-width: 80%; margin-left: auto; margin-right: auto; }
                .button { display: inline-block; background-color: #384A99; color: #ffffff !important; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                .footer { background-color: rgba(0,0,0,0.2); padding: 30px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid rgba(255,255,255,0.05); }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="cid:logo_institucional" alt="CGR" class="logo-institucional">
                    <div style="margin-top: 10px;">
                        <span style="color: #ffffff; font-size: 38px; font-weight: 900; letter-spacing: -1.5px;">CGR</span>
                        <span style="color: #EF8843; font-size: 38px; font-weight: 900; letter-spacing: -1.5px;"> SEGUR@</span>
                    </div>
                    <div style="color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">
                        Programa de Concientización en Ciberseguridad
                    </div>
                </div>
                <div class="content">
                    <div class="congrats">¡Felicidades, ${userName}!</div>
                    <h1>¡Has ganado un nuevo logro!</h1>
                    
                    <div class="badge-container">
                        <img src="cid:user_badge" alt="${badge.name}" class="badge-image">
                    </div>
                    
                    <div class="badge-name">${badge.name}</div>
                    <div class="badge-desc">"${badge.description}"</div>
                    
                    <p>Tu dedicación en el programa de concientización está fortaleciendo la seguridad de nuestra institución.</p>
                    
                    <a href="https://cgrsegura.cgr.go.cr/dashboard" class="button">Ir a la plataforma</a>
                </div>
                <div class="footer">
                    &copy; 2026 Contraloría General de la República de Costa Rica<br>
                    Programa de Concientización en Ciberseguridad
                </div>
            </div>
        </body>
        </html>
        `;

        const attachments = [
            {
                filename: 'logo-cgr-blanco.png',
                path: path.join(assetsPath, 'Logotipo-CGR-blanco-transp.png'),
                cid: 'logo_institucional'
            },
            {
                filename: path.basename(badgePath),
                path: badgePath,
                cid: 'user_badge',
                contentType: badgePath.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
            }
        ];

        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: userEmail,
                subject: `🏆 ¡Nueva insignia ganada: ${badge.name}!`,
                html: htmlContent,
                attachments: attachments
            });
            logger.info(`Email de insignia enviado a: ${userEmail}`);
        } catch (error) {
            logger.error(`Error enviando email de insignia a ${userEmail}:`, error);
            throw error;
        }
    }

    /**
     * Envía un correo de invitación a funcionarios que no han ingresado
     */
    async sendInvitationEmail(userEmail, userName) {
        const path = require('path');
        const fs = require('fs');
        const assetsPath = path.resolve(__dirname, '../assets/images');

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Segoe UI', sans-serif; background-color: #04060b; margin: 0; padding: 0; color: #ffffff; }
                .container { max-width: 600px; margin: 20px auto; background-color: #0b0f1c; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
                .header { background-color: #0d111d; padding: 40px 20px; text-align: center; border-bottom: 2px solid #EF8843; }
                .logo-institucional { width: 120px; }
                .content { padding: 40px; text-align: center; }
                h1 { font-size: 26px; font-weight: 800; color: #ffffff; margin-bottom: 20px; }
                p { color: #94a3b8; line-height: 1.6; font-size: 16px; margin-bottom: 30px; }
                .button { display: inline-block; background-color: #384A99; color: #ffffff !important; text-decoration: none; padding: 16px 40px; border-radius: 16px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
                .footer { background-color: rgba(0,0,0,0.2); padding: 30px; text-align: center; font-size: 11px; color: #475569; border-top: 1px solid rgba(255,255,255,0.05); }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="cid:logo_institucional" alt="CGR" class="logo-institucional">
                    <div style="margin-top: 10px;">
                        <span style="color: #ffffff; font-size: 38px; font-weight: 900;">CGR</span>
                        <span style="color: #EF8843; font-size: 38px; font-weight: 900;"> SEGUR@</span>
                    </div>
                </div>
                <div class="content">
                    <h1>¡Hola, ${userName}!</h1>
                    <p>Te invitamos a formar parte del <strong>Programa de Concientización en Ciberseguridad</strong> de la Contraloría General de la República.</p>
                    <p>Tu participación es fundamental para fortalecer la seguridad digital de nuestra institución. Ingresa hoy mismo y comienza tu camino de aprendizaje.</p>
                    <a href="https://cgrsegura.cgr.go.cr" class="button">Ingresar a la Plataforma</a>
                </div>
                <div class="footer">
                    &copy; 2026 Contraloría General de la República de Costa Rica<br>
                    Programa de Concientización en Ciberseguridad
                </div>
            </div>
        </body>
        </html>
        `;

        const attachments = [
            {
                filename: 'logo-cgr-blanco.png',
                path: path.join(assetsPath, 'Logotipo-CGR-blanco-transp.png'),
                cid: 'logo_institucional'
            }
        ];

        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: userEmail,
                subject: '🛡️ Invitación: Programa de Concientización en Ciberseguridad CGR Segur@',
                html: htmlContent,
                attachments: attachments
            });
            logger.info(`Email de invitación enviado a: ${userEmail}`);
        } catch (error) {
            logger.error(`Error enviando email de invitación a ${userEmail}:`, error);
        }
    }
}

module.exports = new EmailService();
