import React, { useState, useEffect, useRef } from 'react';
import PhaserGame from './DataTetris/PhaserGame';
import './DataTetris/DataTetris.css';
import { Trophy, ShieldAlert, Activity, Hash, Info, ChevronRight, Zap, Maximize, Minimize } from 'lucide-react';

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

    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem(`cgr_dt_highscore_${item.id}`);
        return saved ? parseInt(saved, 10) : 0;
    });

    const handleGameOver = (finalScore) => {
        if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem(`cgr_dt_highscore_${item.id}`, finalScore);
        }

        // Mark as visited if they reached a minimum score or just completed it
        // Depending on requirements. Usually win = mark as visited.
        // For Tetris, maybe just finishing a game is enough if there is no "win" condition other than survival.
        // But let's say they need to reach at least 500 points to "pass" if we want to be strict.
        // Or just finishing is fine.
        if (finalScore >= (data.min_score || 0)) {
            if (!isCompleted) {
                markLinkAsVisited(item.id, { score: finalScore });
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
        setIntegrity(100);
        setGameState('playing');
    };

    return (
        <div
            ref={containerRef}
            className={`data-tetris-container animate-fade-in shadow-2xl border-2 border-white/5 ${isFullscreen ? 'dt-fullscreen bg-slate-950' : ''}`}
        >
            <div className="data-tetris-wrapper relative">
                {/* Fullscreen Toggle Button */}
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-4 right-4 z-[100] p-2 bg-black/40 hover:bg-black/60 text-white/70 hover:text-white rounded-lg border border-white/10 transition-all"
                    title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
                >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
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
                            <div className="dt-overlay">
                                <div className="dt-overlay-content">
                                    <div className="flex justify-center mb-2">
                                        <div className="p-4 bg-primary-500/10 rounded-3xl border border-primary-500/20">
                                            <Activity className="w-12 h-12 text-primary-400" />
                                        </div>
                                    </div>
                                    <h2 className="text-white">Misión: <span className="text-primary-400">Data Sorter</span></h2>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Juego clásico de Tetris, pero con un giro de seguridad de la información.
                                        <br />Clasifica las piezas de datos según su nivel de seguridad antes de que toquen el suelo.
                                        <br />Usa la tecla<strong> ESPACIO</strong> para cambiar el tipo de dato.
                                    </p>

                                    <div className="dt-instructions-grid bg-black/40 p-5 rounded-2xl border border-white/5">
                                        <div className="dt-ins-item"><span>&larr; &rarr;</span> Mover</div>
                                        <div className="dt-ins-item"><span>ESPACIO</span> Clasificar</div>
                                        <div className="dt-ins-item"><span>&uarr;</span> Rotar</div>
                                        <div className="dt-ins-item"><span>&darr;</span> Caída Rápida</div>
                                    </div>

                                    <div className="dt-difficulty-selector">
                                        <span className="dt-stat-label">Nivel de Seguridad</span>
                                        <div className="dt-difficulty-buttons">
                                            <button className={`dt-diff-btn ${difficulty === 'easy' ? 'active' : ''}`} onClick={() => setDifficulty('easy')}>Básico</button>
                                            <button className={`dt-diff-btn ${difficulty === 'medium' ? 'active' : ''}`} onClick={() => setDifficulty('medium')}>Medio</button>
                                            <button className={`dt-diff-btn ${difficulty === 'hard' ? 'active' : ''}`} onClick={() => setDifficulty('hard')}>Avanzado</button>
                                        </div>
                                    </div>

                                    <button className="dt-primary-btn group flex items-center justify-center gap-3" onClick={startGame}>
                                        <Zap className="w-5 h-5 group-hover:animate-pulse" /> Iniciar
                                    </button>
                                </div>
                            </div>
                        )}

                        {gameState === 'playing' && (
                            <PhaserGame
                                difficulty={difficulty}
                                onScoreChange={(s, c) => { setScore(s); setCombo(c); }}
                                onLinesChange={setLines}
                                onIntegrityChange={setIntegrity}
                                onGameOver={handleGameOver}
                            />
                        )}

                        {gameState === 'gameover' && (
                            <div className="dt-overlay">
                                <div className="dt-overlay-content">
                                    <div className="flex justify-center mb-2">
                                        <div className="p-4 bg-red-500/10 rounded-3xl border border-red-500/20">
                                            <ShieldAlert className="w-12 h-12 text-red-400" />
                                        </div>
                                    </div>
                                    <h2 className="text-red-500">Sesión Finalizada</h2>
                                    <p className="text-gray-400 text-sm">El flujo de datos ha superado la capacidad de procesamiento.</p>

                                    <div className="dt-final-stats">
                                        <div className="dt-final-stat">
                                            <span>Puntaje Final</span>
                                            <strong className="text-white">{score}</strong>
                                        </div>
                                        <div className="dt-final-stat">
                                            <span>Líneas Limpias</span>
                                            <strong className="text-primary-400">{lines}</strong>
                                        </div>
                                    </div>

                                    <button className="dt-primary-btn" onClick={() => setGameState('start')}>
                                        Reintentar Protocolo
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
