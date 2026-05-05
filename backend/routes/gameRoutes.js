const express = require('express');
const gameController = require('../controllers/gameController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas de juegos requieren autenticación
router.use(authMiddleware);

router.post('/hack-neighbor/verify', gameController.verifyHackAttempt);

module.exports = router;
