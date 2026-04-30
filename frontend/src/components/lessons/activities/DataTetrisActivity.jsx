import React, { useState, useEffect, useRef } from 'react';
import PhaserGame from './DataTetris/PhaserGame';
import './DataTetris/DataTetris.css';
import CyberCat from '../../CyberCat';
import { Trophy, ShieldAlert, Activity, Hash, Info, ChevronRight, Zap, Maximize, Minimize, Star, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { calculateTetrisPoints, TETRIS_RANKS } from './DataTetris/tetrisUtils';

import { useSoundStore } from '../../../store/soundStore';

export default function DataTetrisActivity({ item, data, visitedLinks, markLinkAsVisited, playSuccess, playError }) {
    const isCompleted = visitedLinks.has(item.id);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [lines, setLines] = useState(0);
    const [integrity, setIntegrity] = useState(100);
    const [gameState, setGameState] = useState('start'); // start, playing, gameover
    const [difficulty, setDifficulty] = useState(data.difficulty || 'easy');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);
    const isMuted = useSoundStore(state => state.isMuted);

    const toggleFullscreen = () => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    useEffect(() => {
        if (gameState === 'start') {
            const initialIntegrity = difficulty === 'hard' ? 50 : difficulty === 'medium' ? 70 : 100;
            setIntegrity(initialIntegrity);
        }
    }, [difficulty, gameState]);

    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem(`cgr_dt_highscore_${item.id}`);
        return saved ? parseInt(saved, 10) : 0;
    });

    const handleGameOver = (finalScore) => {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(err => console.error(err));
        }

        if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem(`cgr_dt_highscore_${item.id}`, finalScore);
        }

        const minScore = data.min_score || 500;
        const basePoints = item.points || 0;
        const results = calculateTetrisPoints(finalScore, minScore, basePoints, difficulty);

        if (finalScore >= minScore) {
            if (!isCompleted) {
                markLinkAsVisited(item.id, {
                    score: finalScore,
                    earnedPoints: results.totalPoints,
                    rank: results.rank
                });
                playSuccess();
            }
        } else {
            playError();
        }

        setGameState('gameover');
    };

    const startGame = () => {
        setScore(0);
        setCombo(0);
        setLines(0);
        const initialIntegrity = difficulty === 'hard' ? 50 : difficulty === 'medium' ? 70 : 100;
        setIntegrity(initialIntegrity);
        setGameState('playing');
    };

    return (
        <div
            ref={containerRef}
            className={`data-tetris-container animate-fade-in shadow-2xl border-2 border-white/5 ${isFullscreen ? 'dt-fullscreen bg-slate-950' : ''}`}
        >
            <div className="data-tetris-wrapper relative">
                <header className="dt-header">
                    <div className="dt-logo-container">
                        <div className="dt-logo-main">
                            <span className="dt-logo-data">DATA</span>
                            <span className="dt-logo-tetris">TETRIS</span>
                        </div>
                        <p className="dt-logo-slogan">Clasificación de Datos CGR</p>
                    </div>

                    <div className="dt-stats-section">
                        <div className="dt-stat-box">
                            <span className="dt-stat-label">Integridad</span>
                            <div className="dt-hearts-grid">
                                {Array.from({ length: 10 }, (_, i) => {
                                    const filled = i < Math.ceil(integrity / 10);
                                    return (
                                        <span key={i} className={`dt-heart ${filled ? 'dt-heart-full' : 'dt-heart-empty'}`}>
                                            {filled ? '❤️' : '🤍'}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="dt-stat-box">
                            <span className="dt-stat-label">Puntos</span>
                            <span className="dt-stat-value text-white">{score}</span>
                        </div>
                        <div className="dt-stat-box">
                            <span className="dt-stat-label">Récord</span>
                            <span className="dt-stat-value dt-stat-value-highlight text-emerald-400">{highScore}</span>
                        </div>
                    </div>
                </header>

                <section className="dt-canvas-section">
                    {gameState === 'playing' && (
                        <aside className="dt-sidebar-left">
                            <div className="dt-sidebar-title">Protocolos</div>
                            <div className="dt-legend-item publico">
                                <div className="dt-legend-dot"></div>
                                <div className="dt-legend-text">
                                    <strong>Público</strong>
                                    <p>Acceso Irrestricto</p>
                                </div>
                            </div>
                            <div className="dt-legend-item confidencial">
                                <div className="dt-legend-dot"></div>
                                <div className="dt-legend-text">
                                    <strong>Restringido</strong>
                                    <p>Datos Personales</p>
                                </div>
                            </div>
                            <div className="dt-legend-item restringido">
                                <div className="dt-legend-dot"></div>
                                <div className="dt-legend-text">
                                    <strong>Sensible</strong>
                                    <p>Privacidad Total</p>
                                </div>
                            </div>

                            <div className="dt-sidebar-hint">
                                <p>Presiona <span>ESPACIO</span> para rotar la clasificación de la pieza.</p>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center">
                                <span className="dt-stat-label">Combo</span>
                                <span className={`dt-combo-val ${combo > 1 ? 'active' : ''}`}>x{combo}</span>
                            </div>
                        </aside>
                    )}

                    <div className="dt-game-container">
                        {gameState === 'start' && (
                            <div
                                className="dt-overlay cursor-pointer"
                                onClick={() => !isFullscreen && toggleFullscreen()}
                                title="Click para expandir y ver instrucciones"
                            >
                                <div className="dt-overlay-content">
                                    <div className="flex flex-col gap-2 mb-2">
                                        <p className="text-gray-300 text-sm leading-relaxed max-width-xl mx-auto font-medium">
                                            Juego clásico de Tetris, pero con un giro de seguridad de la información.
                                            <br />Clasifica las piezas de datos según su nivel de seguridad antes de que toquen el suelo.
                                            <br />Usa la tecla<strong> ESPACIO</strong> para cambiar el tipo de dato.
                                        </p>
                                    </div>

                                    <div className="dt-overlay-grid">
                                        {/* Columna Izquierda: Recompensas */}
                                        <div className="dt-overlay-left">
                                            <div className="bg-black/40 rounded-2xl p-5 border border-white/5 flex-1 flex flex-col">
                                                <div className="flex items-center gap-2 mb-4 justify-center">
                                                    <Star className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Tabla de Recompensas</span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2 flex-1">
                                                    {TETRIS_RANKS.map(rank => {
                                                        const minScore = data.min_score || 500;
                                                        const thresholdScore = Math.ceil(minScore * rank.threshold);
                                                        const basePoints = item.points || 0;
                                                        const pot = Math.round((basePoints * (1 + (rank.bonus / 100))) * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.2 : 1.5));

                                                        return (
                                                            <div key={rank.name} className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 px-4">
                                                                <span className={`text-[10px] font-black uppercase ${rank.color}`}>{rank.name}</span>
                                                                <span className="text-white text-sm font-bold">{thresholdScore} <span className="text-[8px] text-gray-500 uppercase">Pts</span></span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Columna Derecha: Controles y Dificultad */}
                                        <div className="dt-overlay-right">
                                            <div className="dt-instructions-grid bg-black/40 p-5 rounded-2xl border border-white/5">
                                                <div className="dt-ins-item"><span>&larr; &rarr;</span> Mover</div>
                                                <div className="dt-ins-item"><span>ESPACIO</span> Clasificar</div>
                                                <div className="dt-ins-item"><span>&uarr;</span> Rotar</div>
                                                <div className="dt-ins-item"><span>&darr;</span> Caída Rápida</div>
                                            </div>

                                            <div className="dt-difficulty-section bg-black/40 p-5 rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-2 mb-4 justify-center">
                                                    <Award className="w-4 h-4 text-primary-400" />
                                                    <span className="text-xs font-black uppercase tracking-widest text-gray-300">Nivel de Dificultad</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {[
                                                        { id: 'easy', label: 'Básico', mult: '1.0x', color: 'text-emerald-400' },
                                                        { id: 'medium', label: 'Medio', mult: '1.2x', color: 'text-amber-400' },
                                                        { id: 'hard', label: 'Avanzado', mult: '1.5x', color: 'text-rose-400' }
                                                    ].map(level => (
                                                        <button
                                                            key={level.id}
                                                            onClick={() => setDifficulty(level.id)}
                                                            className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${difficulty === level.id
                                                                ? 'bg-primary-500/20 border-primary-500/50 scale-[1.02] ring-1 ring-primary-500/30'
                                                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            <span className={`text-[10px] font-black uppercase ${difficulty === level.id ? level.color : 'text-gray-500'}`}>{level.label}</span>
                                                            <span className={`text-xs font-bold ${difficulty === level.id ? 'text-white' : 'text-gray-400'}`}>{level.mult}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <button className="dt-primary-btn group w-full" onClick={startGame}>
                                                <Zap className="w-5 h-5 group-hover:animate-pulse text-yellow-400" />
                                                <span>Iniciar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {gameState === 'playing' && (
                            <PhaserGame
                                difficulty={difficulty}
                                isMuted={isMuted}
                                onScoreChange={(s, c) => { setScore(s); setCombo(c); }}
                                onLinesChange={setLines}
                                onIntegrityChange={setIntegrity}
                                onGameOver={handleGameOver}
                            />
                        )}

                        {gameState === 'gameover' && (
                            <div className="dt-overlay">
                                <div className="dt-overlay-content">
                                    <div className="flex justify-center mb-6">
                                        <div className="p-2 bg-red-500/10 rounded-full border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.25)]">
                                            <CyberCat variant="panic" className="w-32 h-32" />
                                        </div>
                                    </div>
                                    <h2 className="text-red-500 text-2xl font-black uppercase tracking-tighter mb-2">¡Sistema Comprometido!</h2>
                                    <p className="text-gray-400 text-sm">El flujo de datos ha superado la capacidad de procesamiento.</p>

                                    <div className="dt-final-stats">
                                        <div className="dt-final-stat">
                                            <span>Puntaje Final</span>
                                            <strong className="text-white">{score}</strong>
                                        </div>
                                        <div className="dt-final-stat">
                                            <span>Rango Alcanzado</span>
                                            <strong className="text-primary-400 text-sm">{calculateTetrisPoints(score, data.min_score || 500, item.points || 0, difficulty).rank}</strong>
                                        </div>
                                    </div>

                                    <button className="dt-primary-btn" onClick={() => setGameState('start')}>
                                        Reintentar
                                    </button>

                                    {isCompleted && (
                                        <div className="flex items-center gap-2 justify-center text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-400/10 py-2 px-4 rounded-xl border border-emerald-400/20">
                                            <Trophy className="w-4 h-4" /> Actividad Completada
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <footer className="mt-4 flex justify-between items-center opacity-40">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500">
                        <Info className="w-3 h-3" /> Use las flechas para navegar
                    </div>
                    <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
                        Data Integrity Module v1.0
                    </div>
                </footer>
            </div>
        </div>
    );
}
