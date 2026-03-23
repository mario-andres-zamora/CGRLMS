const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Script de Pruebas de Estrés para CGR LMS
 * Simula el acceso simultáneo de N funcionarios realizando acciones comunes.
 */

const API_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';
const CONCURRENT_USERS = 700;
const TEST_DURATION_MS = 30000; // 30 segundos
const ENDPOINTS = [
    '/health',
    '/modules',
    '/gamification/leaderboard',
    '/dashboard',
    '/lessons/1',
    '/reports/compliance',
];

// Estadísticas de la prueba
const stats = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    rtt: [] // Round Trip Times
};

async function simulateUser(id) {
    const startTime = Date.now();
    const endTime = startTime + TEST_DURATION_MS;
    
    // En una prueba real, cada usuario debería tener su propia cookie de sesión.
    // Aquí simularemos el tráfico a los endpoints.
    // NOTA: Para que esto funcione con authMiddleware, necesitarías tokens reales o deshabilitarlo temporalmente.
    
    while (Date.now() < endTime) {
        const endpoint = ENDPOINTS[Math.floor(Math.random() * ENDPOINTS.length)];
        const reqStart = Date.now();
        
        try {
            const config = { timeout: 10000 };
            
            // Si hay una cookie de sesión configurada en .env o por argumento
            if (process.env.TEST_SESSION_COOKIE) {
                config.headers = { 'Cookie': `connect.sid=${process.env.TEST_SESSION_COOKIE}` };
            }

            await axios.get(`${API_URL}${endpoint}`, config);
            
            stats.successfulRequests++;
            stats.rtt.push(Date.now() - reqStart);
        } catch (err) {
            stats.failedRequests++;
            // Solo loguear el primer error grave para no saturar consola
            if (stats.failedRequests === 1) {
                console.error(`\n❌ Error de ejemplo (User ${id} at ${endpoint}):`);
                console.error(`   Status: ${err.response?.status || 'TIMEOUT/NETWORK'}`);
                console.error(`   Message: ${err.response?.data?.error || err.message}\n`);
                console.log('   (Omitiendo el resto para mayor claridad...)\n');
            }
        }
        
        stats.totalRequests++;
        
        // Pequeña espera aleatoria (think time) entre 500ms y 2s
        await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
    }
}

async function runStressTest() {
    console.log(`🚀 Iniciando prueba de estrés: ${CONCURRENT_USERS} usuarios simultáneos...`);
    console.log(`⏱️ Duración estimada: ${TEST_DURATION_MS / 1000}s`);
    console.log(`🔗 Target: ${API_URL}`);

    const start = Date.now();
    const users = [];

    for (let i = 0; i < CONCURRENT_USERS; i++) {
        users.push(simulateUser(i));
        // Ramp-up: No lanzamos todos al milisegundo exacto para evitar picos de red locales
        if (i % 50 === 0) await new Promise(r => setTimeout(r, 100));
    }

    await Promise.all(users);

    const totalTime = (Date.now() - start) / 1000;
    const avgRtt = stats.rtt.length > 0 ? (stats.rtt.reduce((a, b) => a + b, 0) / stats.rtt.length).toFixed(2) : 0;
    const throughput = (stats.totalRequests / totalTime).toFixed(2);

    console.log('\n--- 📊 RESULTADOS DE LA PRUEBA ---');
    console.log(`Total de peticiones: ${stats.totalRequests}`);
    console.log(`✅ Exitosas: ${stats.successfulRequests}`);
    console.log(`❌ Fallidas: ${stats.failedRequests}`);
    console.log(`⏱️ Tiempo promedio de respuesta: ${avgRtt} ms`);
    console.log(`📈 Throughput: ${throughput} peticiones/segundo`);
    console.log(`🏁 Duración total: ${totalTime.toFixed(2)}s`);
    console.log('----------------------------------\n');

    if (stats.failedRequests > stats.totalRequests * 0.05) {
        console.warn('⚠️ ALERTA: Más del 5% de las peticiones fallaron. El sistema podría estar saturado.');
    } else {
        console.log('✅ El sistema se comportó de manera estable bajo carga.');
    }
}

runStressTest();
