import React from 'react';
import { Mail, Briefcase, Building2, Shield, Zap } from 'lucide-react';

export default function ProfileHero({ user, stats }) {
    return (
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl transition-colors duration-300"
            style={{ background: 'linear-gradient(135deg, var(--card-bg) 0%, var(--bg-color) 100%)' }}>

            {/* Light-mode premium border */}
            <div className="absolute inset-0 rounded-[2.5rem] border border-[var(--card-border)] pointer-events-none" />

            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-primary-500/6 via-secondary-500/4 to-transparent pointer-events-none" />
            <div className="absolute -top-10 left-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-20 w-48 h-48 bg-secondary-500/5 rounded-full blur-2xl pointer-events-none" />

            {/* Top accent stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-t-[2.5rem]" />

            <div className="relative z-10 p-6 md:py-8 md:px-12 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                {/* Portrait */}
                <div className="relative flex-shrink-0">
                    <div className="w-36 h-36 rounded-[2rem] p-[3px] bg-gradient-to-tr from-primary-500 via-secondary-500 to-accent-500 shadow-xl">
                        <div className="w-full h-full bg-[var(--bg-color)] rounded-[1.8rem] overflow-hidden">
                            <img
                                src={user.profile_picture || `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=384A99&color=fff&size=200`}
                                alt={user.first_name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-secondary-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-lg border-4 border-[var(--bg-color)]">
                        <Shield className="w-5 h-5" />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left space-y-4 min-w-0">
                    <div className="space-y-2">
                        <h1 className="text-3xl lg:text-4xl font-black text-[var(--text-color)] tracking-tighter uppercase leading-none flex items-center justify-center md:justify-start gap-3 flex-wrap">
                            {user.first_name} {user.last_name}
                            {user.login_streak > 1 && (
                                <div className="group relative cursor-help">
                                    <div className="flex items-center gap-1 bg-secondary-500/10 border border-secondary-500/20 rounded-full px-2 py-0.5">
                                        <Zap className="w-3.5 h-3.5 text-secondary-500 fill-secondary-500/20 animate-pulse" />
                                        <span className="text-[9px] font-black text-secondary-500 uppercase tracking-widest">x{user.login_streak}</span>
                                    </div>
                                    <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                                        <div className="w-2 h-2 bg-[#1a2347] border-l border-t border-white/15 rotate-45 mx-auto -mb-1 relative z-10" />
                                        <div className="bg-[#1a2347] border border-white/15 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-2xl whitespace-nowrap">
                                            Racha activa: <span className="text-secondary-400">x{user.login_streak} días</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </h1>

                        <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1 mt-2">
                            <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                                <Mail className="w-3.5 h-3.5 text-primary-500/70" /> {user.email}
                            </span>
                            <span className="hidden md:block text-[var(--card-border)]">•</span>
                            <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                                <Building2 className="w-3.5 h-3.5 text-primary-500/70" />
                                <span className="text-[var(--text-muted)]/70 mr-0.5">Área:</span> {user.department || 'Sin asignar'}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] font-medium">
                                <Briefcase className="w-3.5 h-3.5 text-primary-500/70" />
                                <span className="text-[var(--text-muted)]/70 mr-0.5">Puesto:</span> {user.position || 'Sin asignar'}
                            </span>
                        </div>
                    </div>

                    {/* Level & Progress */}
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Rango Actual</p>
                                <p className="text-xl font-black text-[var(--text-color)] tracking-tighter uppercase italic leading-tight mt-0.5">
                                    {stats.level}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">Siguiente Rango</p>
                                <p className="text-xl font-black text-secondary-500 uppercase italic leading-tight mt-0.5">
                                    {stats.next_level_name}
                                </p>
                            </div>
                        </div>

                        {/* Progress bar */}
                        <div className="relative">
                            <div className="h-2 bg-[var(--bg-color)] rounded-full border border-[var(--card-border)] overflow-hidden shadow-inner">
                                <div
                                    className="h-full bg-gradient-to-r from-secondary-600 via-secondary-400 to-secondary-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(229,123,60,0.35)]"
                                    style={{ width: `${stats.level_progress_percentage || 0}%` }}
                                />
                            </div>
                            {/* Progress percentage pill */}
                            <div
                                className="absolute -top-5 text-[8px] font-black text-secondary-500 uppercase tracking-widest transition-all duration-1000"
                                style={{ left: `clamp(0%, ${stats.level_progress_percentage || 0}% - 10px, 90%)` }}
                            >
                                {stats.level_progress_percentage || 0}%
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-0.5">
                            <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                                <span className="text-[var(--text-color)] text-sm font-black">{stats.points}</span> pts totales
                            </span>
                            {stats.next_level_min_points ? (
                                <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                                    Próximo nivel: <span className="text-secondary-500 text-sm">{stats.next_level_min_points}</span> pts
                                </span>
                            ) : (
                                <span className="text-[10px] font-black text-secondary-500 uppercase tracking-widest animate-pulse">
                                    Leyenda Máxima
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
