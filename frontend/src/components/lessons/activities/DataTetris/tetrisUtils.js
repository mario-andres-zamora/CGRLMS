/**
 * Calcula los puntos totales obtenidos en Data Tetris incluyendo bonificaciones por desempeño y dificultad.
 */
export const calculateTetrisPoints = (finalScore, minScore, basePoints, difficulty) => {
    let bonusMultiplier = 0;
    let rank = 'Sobreviviente';
    
    if (finalScore >= minScore * 3) {
        bonusMultiplier = 1.0;
        rank = 'Leyenda';
    } else if (finalScore >= minScore * 2) {
        bonusMultiplier = 0.5;
        rank = 'Maestro';
    } else if (finalScore >= minScore * 1.5) {
        bonusMultiplier = 0.25;
        rank = 'Experto';
    }

    let diffMultiplier = 1.0;
    if (difficulty === 'medium') diffMultiplier = 1.2;
    else if (difficulty === 'hard') diffMultiplier = 1.5;

    const totalPoints = Math.round((basePoints * (1 + bonusMultiplier)) * diffMultiplier);
    
    return {
        totalPoints,
        bonusPoints: totalPoints - basePoints,
        rank,
        bonusPercentage: Math.round(bonusMultiplier * 100),
        diffMultiplier
    };
};

export const TETRIS_RANKS = [
    { name: 'Sobreviviente', threshold: 1, bonus: 0, color: 'text-gray-400' },
    { name: 'Experto', threshold: 1.5, bonus: 25, color: 'text-blue-400' },
    { name: 'Maestro', threshold: 2, bonus: 50, color: 'text-purple-400' },
    { name: 'Leyenda', threshold: 3, bonus: 100, color: 'text-yellow-400' }
];
