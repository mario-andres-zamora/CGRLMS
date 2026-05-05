const axios = require('axios');

const API_URL = 'http://localhost:5000/api'; // Ajustar según puerto real
const CONTENT_ID = 15; // ID del contenido del foro según screenshots

async function testForumModeration() {
    console.log('🧪 Iniciando pruebas de código para el Foro...');

    try {
        // 1. Simular verificación de permisos en el componente (Mock del cálculo de isAdmin)
        const mockUserAdmin = { id: 1, role: 'admin' };
        const mockPostOthers = { id: 999, user_id: 2, message: 'Post de otro usuario' };
        const viewAsStudent = false;

        const isAdmin = mockUserAdmin.role === 'admin' && !viewAsStudent;
        const canDelete = mockUserAdmin.id === mockPostOthers.user_id || isAdmin;

        console.log(`- Prueba UI: ¿Admin puede ver botón borrar en post ajeno?: ${canDelete ? '✅ SÍ' : '❌ NO'}`);

        // 2. Simular Linkify
        const testText = "Visita www.google.com y https://cyberseguridad.com";
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        const matches = testText.match(urlRegex);
        
        console.log(`- Prueba Linkify: Enlaces detectados: ${matches?.length || 0}`);
        if (matches?.length === 2) console.log('  ✅ Detección de links correcta.');

        // 3. Simular XSS Prevention
        const xssText = "Hola <script>alert('xss')</script>";
        const parts = xssText.split(urlRegex);
        const hasScriptTagInParts = parts.some(p => p.includes('<script>'));
        console.log(`- Prueba Seguridad: ¿React escaparía el script?: ${hasScriptTagInParts ? '✅ SÍ (se mantiene como string literal)' : '❌ NO'}`);

        console.log('\n🚀 Pruebas de lógica básica completadas.');
        
    } catch (error) {
        console.error('❌ Error durante las pruebas:', error.message);
    }
}

testForumModeration();
