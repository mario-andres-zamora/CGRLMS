const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/auth/google
 * @desc    Autenticación con Google OAuth (Session based)
 * @access  Public
 */
router.post('/google', (req, res) => authController.googleAuth(req, res));

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Private
 */
router.post('/logout', (req, res) => authController.logout(req, res));

/**
 * @route   GET /api/auth/verify
 * @desc    Verificar sesión activa
 * @access  Private
 */
router.get('/verify', (req, res) => authController.verifySession(req, res));

module.exports = router;
