import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, ChevronLeft, ChevronRight, ShieldAlert, Terminal, Smartphone, XCircle, CheckCircle2 } from 'lucide-react';

function MfaDefenderQuestion({ question, isAnswered, onWin }) {
    const [mfaStatus, setMfaStatus] = useState(isAnswered ? 'won' : 'idle');
    const [mfaCode, setMfaCode] = useState('------');
    const [userMfaInput, setUserMfaInput] = useState('');
    const hackTimeLimit = question.data?.hack_time || 20;
    const mfaRotateTime = question.data?.rotate_time || 5;
    const [timeLeft, setTimeLeft] = useState(hackTimeLimit);
    const [rotateProgress, setRotateProgress] = useState(100);

    const generateMfaCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const startMfaGame = () => {
        if (isAnswered) return;
        setMfaStatus('playing');
        setTimeLeft(hackTimeLimit);
        setMfaCode(generateMfaCode());
        setRotateProgress(100);
        setUserMfaInput('');
    };

    useEffect(() => {
        let interval;
        if (mfaStatus === 'playing') {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 0.1) {
                        setMfaStatus('failed');
                        return 0;
                    }
                    return prev - 0.1;
                });

                setRotateProgress(prev => {
                    const step = (100 / (mfaRotateTime * 10));
                    if (prev <= step) {
                        setMfaCode(generateMfaCode());
                        return 100;
                    }
                    return prev - step;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [mfaStatus, hackTimeLimit, mfaRotateTime]);

    const handleMfaSubmit = () => {
        if (mfaStatus !== 'playing') return;

        if (userMfaInput === mfaCode) {
            setMfaStatus('won');
            onWin();
        } else {
            setUserMfaInput('');
        }
    };

    return (
        <div className={`p-8 mt-4 rounded-[2.5rem] transition-all duration-700 border-2 ${mfaStatus === 'won' ? 'bg-indigo-500/10 border-indigo-500/30' : mfaStatus === 'failed' ? 'bg-red-500/10 border-red-500/30 animate-shake' : 'bg-slate-900/40 border-white/5'}`}>
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto w-full">
                    {/* Left Side: Hacker Terminal */}
                    <div className="bg-[#0a0a0a] rounded-3xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0"></div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-red-500 animate-pulse">
                                <div className="flex items-center gap-2"><Terminal className="w-4 h-4" /> Intruso Detectado</div>
                                <div>IP 192.168.XXX.XXX</div>
                            </div>
                            <div className="font-mono text-sm text-gray-500 leading-relaxed font-bold break-words">
                                &gt; Extrayendo credenciales... OK<br />
                                &gt; Match de contraseña... OK<br />
                                &gt; Obteniendo acceso root...
                            </div>
                        </div>
                        <div className="mt-8 space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-black text-red-400 uppercase tracking-widest">Progreso del Hackeo</span>
                                <span className="font-mono text-red-500 font-bold">{Math.max(0, timeLeft).toFixed(1)}s</span>
                            </div>
                            <div className="w-full h-3 bg-red-950/50 rounded-full overflow-hidden border border-red-500/20">
                                <div
                                    className="h-full bg-red-500 rounded-full transition-all duration-100 relative"
                                    style={{ width: `${(1 - (timeLeft / hackTimeLimit)) * 100}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Virtual Authenticator Phone */}
                    <div className="bg-slate-800 rounded-3xl p-6 border-4 border-slate-700 relative shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
                        <div className="absolute top-2 w-16 h-1.5 bg-slate-900 rounded-full"></div>

                        {mfaStatus === 'idle' ? (
                            <button
                                onClick={startMfaGame}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs px-8 py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 hover:scale-105 active:scale-95 text-center"
                            >
                                <ShieldAlert className="w-5 h-5" /> Iniciar Defensa
                            </button>
                        ) : mfaStatus === 'failed' ? (
                            <div className="text-center space-y-4 animate-fade-in">
                                <XCircle className="w-16 h-16 text-red-500 mx-auto animate-shake" />
                                <div className="text-red-400 font-black uppercase tracking-widest">¡Sistema Comprometido!</div>
                                <button
                                    onClick={startMfaGame}
                                    className="bg-slate-700 hover:bg-slate-600 text-white font-bold text-[10px] uppercase px-4 py-2 rounded-lg transition-colors mt-2"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : mfaStatus === 'won' ? (
                            <div className="text-center space-y-4 animate-fade-in p-2">
                                <CheckCircle2 className="w-16 h-16 text-indigo-400 mx-auto scale-110" />
                                <div className="text-indigo-400 font-black uppercase tracking-widest text-lg">¡Misión Cumplida: Ataque Detenido!</div>
                                <div className="text-sm text-slate-300 font-medium leading-relaxed">
                                    Como acabas de experimentar, la contraseña por sí sola ya no es suficiente. En este escenario, el atacante logró obtener tus credenciales, pero se topó con un muro: el MFA (Autenticación de Múltiples Factores).
                                </div>
                                <div className="bg-slate-900/50 p-4 rounded-xl text-left border border-indigo-500/20 mt-4">
                                    <div className="text-indigo-400 font-bold mb-1">¿Por qué el MFA es tu mejor aliado?</div>
                                    <div className="text-xs text-slate-400">
                                        La importancia de activar y utilizar el MFA radica en que añade una capa de seguridad física o digital que el atacante no posee.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full space-y-6 text-center animate-fade-in">
                                <div className="flex items-center justify-center gap-2 text-indigo-400 mb-2">
                                    <Smartphone className="w-5 h-5" />
                                    <span className="font-extrabold text-[11px] uppercase tracking-widest text-slate-400">Authenticator App</span>
                                </div>
                                <div className="font-mono text-4xl text-white font-black tracking-[0.2em]">
                                    {mfaCode.substring(0, 3)} <span className="text-indigo-400">{mfaCode.substring(3)}</span>
                                </div>
                                <div className="w-full max-w-[200px] mx-auto h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all duration-100"
                                        style={{ width: `${rotateProgress}%` }}
                                    ></div>
                                </div>
                                <div className="pt-4 space-y-3">
                                    <input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={userMfaInput}
                                        onChange={(e) => setUserMfaInput(e.target.value.replace(/\D/g, ''))}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && userMfaInput.length === 6) {
                                                handleMfaSubmit();
                                            }
                                        }}
                                        className="w-full bg-slate-900 border-2 border-indigo-500/30 focus:border-indigo-500 rounded-xl py-3 text-center text-xl font-mono text-white outline-none transition-colors"
                                    />
                                    <button
                                        onClick={handleMfaSubmit}
                                        disabled={userMfaInput.length < 6}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:opacity-50 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all shadow-lg active:scale-95"
                                    >
                                        Verificar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function QuizTake({
    quiz,
    questions,
    currentQuestionIndex,
    answers,
    onOptionSelect,
    onNext,
    onPrev,
    onSubmit,
    submitting,
    attemptsMade,
    onBack
}) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="w-full px-4 sm:px-6 lg:px-12 space-y-4 animate-fade-in pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Salir de la evaluación
                    </button>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">{quiz.title}</h1>
                </div>
                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Intento</p>
                        <p className="text-xl font-black text-white">{(attemptsMade || 0) + 1} <span className="text-gray-600">/ {quiz.max_attempts}</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pregunta</p>
                        <p className="text-xl font-black text-white">{currentQuestionIndex + 1} <span className="text-gray-600">/ {questions.length}</span></p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(56,74,153,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="card px-4 md:px-8 py-3 md:py-4 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-full blur-2xl"></div>

                <div className="space-y-3 relative z-10">
                    <div className="flex flex-col gap-2">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-secondary-500/10 rounded-full border border-secondary-500/20 self-start">
                            <Target className="w-3 h-3 text-secondary-500" />
                            <span className="text-[8px] font-black text-secondary-400 uppercase tracking-widest">Actividad de Evaluación</span>
                        </div>
                    </div>

                    {currentQuestion.image_url && (
                        <div className="w-full max-h-96 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950/40 flex justify-center">
                            <img
                                src={currentQuestion.image_url}
                                alt="Contexto de la pregunta"
                                className="max-w-full max-h-96 object-contain"
                            />
                        </div>
                    )}
                    <h2 className="text-sm md:text-base font-bold text-white leading-relaxed tracking-tight text-left">
                        {currentQuestion.question_text}
                    </h2>
                </div>

                {currentQuestion.question_type !== 'mfa_defender' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 relative z-10">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => onOptionSelect(currentQuestion.id, option.id)}
                                className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 group flex items-center justify-between ${answers[currentQuestion.id] === option.id
                                    ? 'bg-primary-500/10 border-primary-500 text-white shadow-[0_0_30px_rgba(56,74,153,0.2)]'
                                    : 'bg-slate-900/50 border-white/5 text-gray-400 hover:border-white/10 hover:bg-slate-900 group'
                                    }`}
                            >
                                <span className="font-bold">{option.option_text}</span>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQuestion.id] === option.id
                                    ? 'border-primary-400 bg-primary-400'
                                    : 'border-gray-700'
                                    }`}>
                                    {answers[currentQuestion.id] === option.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                </div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="relative z-10">
                        <MfaDefenderQuestion
                            question={currentQuestion}
                            isAnswered={answers[currentQuestion.id] === true || answers[currentQuestion.id] === 'true'}
                            onWin={() => onOptionSelect(currentQuestion.id, true)}
                        />
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between py-6 mt-4 border-t border-white/5">
                <button
                    onClick={onPrev}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center gap-2 px-8 py-3 bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-slate-700 hover:border-orange-500/50 transition-all disabled:opacity-0"
                >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                    <button
                        onClick={onSubmit}
                        disabled={submitting}
                        className="px-10 py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:from-orange-500 hover:to-orange-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
                    >
                        {submitting ? 'Calificando...' : 'Finalizar Evaluación'}
                    </button>
                ) : (
                    <button
                        onClick={onNext}
                        className="flex items-center gap-2 px-10 py-3.5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:from-orange-500 hover:to-orange-400 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20 group"
                    >
                        Siguiente <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
}
