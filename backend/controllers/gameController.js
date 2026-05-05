const { HACK_PROFILES } = require('../constants/gamesData');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

/**
 * Verifica el intento de hackeo para un perfil específico
 */
exports.verifyHackAttempt = catchAsync(async (req, res, next) => {
    const { profileId, index, password } = req.body;

    if ((profileId === undefined && index === undefined) || !password) {
        return next(new AppError('Por favor proporcione el ID del perfil o el índice y la contraseña', 400));
    }


    // El frontend usa un índice basado en item.id % HACK_PROFILES.length
    // O recibe el ID directamente. Vamos a manejar ambos casos.
    // En HackNeighborGame.jsx: const index = (item.id % HACK_PROFILES.length);
    // En QuizTake.jsx: const index = ((question.id + (sessionSeed || 0)) % HACK_PROFILES.length);

    // Para hacerlo más robusto, el frontend debería enviar el ID del perfil calculado o el ID de la lección/pregunta.
    // Pero si enviamos el "index" directamente es más fácil.
    let profile;
    if (index !== undefined) {
        profile = HACK_PROFILES[index];
    } else {
        profile = HACK_PROFILES.find(p => p.id === profileId);
    }

    if (!profile) {
        return next(new AppError('Perfil no encontrado', 404));
    }

    const isCorrect = profile.password === password;

    res.status(200).json({
        success: true,
        isCorrect,
        // Solo enviamos la contraseña si es correcta (para mostrarla en el mensaje de éxito)
        password: isCorrect ? profile.password : undefined
    });
});
