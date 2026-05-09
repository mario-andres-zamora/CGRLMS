import { ShieldAlert, Loader2, Users, UsersRound, Palette } from 'lucide-react';

export default function SecurityTab({ 
    maintenanceMode, 
    rankingLimitGlobal, 
    rankingLimitDepartment, 
    allowThemeChange,
    onToggleMaintenance, 
    onUpdateRankingLimit,
    onToggleThemeChange
}) {
    return (
        <div className="space-y-4 animate-fade-in max-w-4xl mx-auto py-4">
            <div className="bg-slate-900 border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.3)] group relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

                <h3 className="text-lg font-black text-white uppercase tracking-tighter italic mb-6 flex items-center gap-4">
                    <ShieldAlert className="w-8 h-8 text-yellow-500 bg-yellow-500/10 p-2 rounded-xl border border-yellow-500/20 shadow-xl shadow-yellow-500/10" />
                    Ajustes Generales
                </h3>

                <div className="grid grid-cols-1 gap-6">
                    {/* Maintenance Mode */}
                    <div className="bg-slate-950/60 p-5 rounded-[1.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-slate-950/80 transition-all duration-700 shadow-inner group/item relative z-10">
                        <div className="space-y-1 text-center md:text-left flex-1 h-full">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <h4 className="text-sm font-black text-white uppercase tracking-widest italic group-hover/item:text-yellow-500 transition-colors">Modo de Mantenimiento</h4>
                                <div className={`w-1.5 h-1.5 rounded-full ${maintenanceMode ? 'bg-yellow-500 animate-ping' : 'bg-emerald-500'} shadow-lg`}></div>
                            </div>
                            <p className="text-[10px] text-gray-500 font-black leading-relaxed max-w-lg uppercase tracking-[0.2em] italic opacity-60 group-hover/item:opacity-100 transition-opacity">
                                Restringe el acceso total a la plataforma.
                            </p>
                        </div>

                        <button
                            onClick={onToggleMaintenance}
                            className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-700 focus:outline-none shadow-2xl border-2 ${maintenanceMode ? 'bg-yellow-500 border-yellow-400/30' : 'bg-slate-800 border-white/5 shadow-inner opacity-60 hover:opacity-100'}`}
                        >
                            <span className={`inline-block h-7 w-7 transform rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all duration-700 ${maintenanceMode ? 'translate-x-11 scale-110 rotate-180' : 'translate-x-1'}`}>
                                {maintenanceMode ? <Loader2 className="w-4 h-4 text-yellow-600 m-1.5 animate-spin" /> : null}
                            </span>
                        </button>
                    </div>

                    {/* Global Ranking Limit */}
                    <div className="bg-slate-950/40 p-5 rounded-[1.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-slate-950/60 transition-all duration-700 shadow-inner group/item relative z-10">
                        <div className="space-y-1 text-center md:text-left flex-1 h-full">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <Users className="w-4 h-4 text-primary-400" />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest italic group-hover/item:text-primary-400 transition-colors">Ranking Institucional</h4>
                            </div>
                            <p className="text-[10px] text-gray-500 font-black leading-relaxed max-w-lg uppercase tracking-[0.2em] italic opacity-60 group-hover/item:opacity-100 transition-opacity">
                                Define si quieres limitar la visibilidad de la tabla global.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-900/50 p-2.5 rounded-2xl border border-white/5">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Limitar</span>
                                <button
                                    onClick={() => onUpdateRankingLimit('rankingLimitGlobal', rankingLimitGlobal === 0 ? 100 : 0)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${rankingLimitGlobal > 0 ? 'bg-primary-600' : 'bg-slate-700'}`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-all duration-300 ${rankingLimitGlobal > 0 ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                            </div>

                            {rankingLimitGlobal > 0 && (
                                <div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-right-4">
                                    <span className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Máximo</span>
                                    <input
                                        type="number"
                                        value={rankingLimitGlobal}
                                        onChange={(e) => onUpdateRankingLimit('rankingLimitGlobal', Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-white font-black text-xs text-center focus:border-primary-500 focus:outline-none transition-all"
                                    />
                                </div>
                            )}

                            {rankingLimitGlobal === 0 && (
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in zoom-in">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ilimitado</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Department Ranking Limit */}
                    <div className="bg-slate-950/40 p-5 rounded-[1.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-slate-950/60 transition-all duration-700 shadow-inner group/item relative z-10">
                        <div className="space-y-1 text-center md:text-left flex-1 h-full">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <UsersRound className="w-4 h-4 text-secondary-400" />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest italic group-hover/item:text-secondary-400 transition-colors">Ranking por Áreas</h4>
                            </div>
                            <p className="text-[10px] text-gray-500 font-black leading-relaxed max-w-lg uppercase tracking-[0.2em] italic opacity-60 group-hover/item:opacity-100 transition-opacity">
                                Define si quieres limitar el número de áreas mostradas.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-900/50 p-2.5 rounded-2xl border border-white/5">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Limitar</span>
                                <button
                                    onClick={() => onUpdateRankingLimit('rankingLimitDepartment', rankingLimitDepartment === 0 ? 10 : 0)}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${rankingLimitDepartment > 0 ? 'bg-secondary-600' : 'bg-slate-700'}`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-all duration-300 ${rankingLimitDepartment > 0 ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                            </div>

                            {rankingLimitDepartment > 0 && (
                                <div className="flex flex-col items-center gap-1 animate-in fade-in slide-in-from-right-4">
                                    <span className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Máximo</span>
                                    <input
                                        type="number"
                                        value={rankingLimitDepartment}
                                        onChange={(e) => onUpdateRankingLimit('rankingLimitDepartment', Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-white font-black text-xs text-center focus:border-secondary-500 focus:outline-none transition-all"
                                    />
                                </div>
                            )}

                            {rankingLimitDepartment === 0 && (
                                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in zoom-in">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Ilimitado</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Theme Personalization Control */}
                    <div className="bg-slate-950/40 p-5 rounded-[1.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 hover:bg-slate-950/60 transition-all duration-700 shadow-inner group/item relative z-10">
                        <div className="space-y-1 text-center md:text-left flex-1 h-full">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <Palette className="w-4 h-4 text-indigo-400" />
                                <h4 className="text-sm font-black text-white uppercase tracking-widest italic group-hover/item:text-indigo-400 transition-colors">Personalización de Tema</h4>
                            </div>
                            <p className="text-[10px] text-gray-500 font-black leading-relaxed max-w-lg uppercase tracking-[0.2em] italic opacity-60 group-hover/item:opacity-100 transition-opacity">
                                Permite que los usuarios cambien el tema visual de la aplicación.
                            </p>
                        </div>

                        <div className="flex items-center gap-4 bg-slate-900/50 p-2.5 rounded-2xl border border-white/5">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Permitir</span>
                                <button
                                    onClick={onToggleThemeChange}
                                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 ${allowThemeChange ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20' : 'bg-slate-700'}`}
                                >
                                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-all duration-300 ${allowThemeChange ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
