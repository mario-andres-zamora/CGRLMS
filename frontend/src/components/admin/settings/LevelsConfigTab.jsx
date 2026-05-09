import { Trophy, Info, RefreshCw, Save, Loader2 } from 'lucide-react';

export default function LevelsConfigTab({ levels, onUpdateLevel, onRefreshRanking, onSave, saving }) {
    return (
        <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
            <div className="bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md text-left">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-950/40 border-b border-white/5">
                            <th className="px-6 py-3 text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] w-20">Escala</th>
                            <th className="px-6 py-3 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">Nombre del Nivel</th>
                            <th className="px-6 py-3 text-left text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] w-40">Puntos Requeridos</th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {levels.map((level, index) => (
                            <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                                {/* Escala */}
                                <td className="px-6 py-2.5 text-center">
                                    <div className={`w-10 h-10 mx-auto rounded-xl ${level.bgColor} ${level.color} flex items-center justify-center shadow-lg border border-white/5 group-hover:scale-110 transition-transform`}>
                                        <level.icon className="w-5 h-5" />
                                    </div>
                                </td>
                                {/* Nombre del Nivel */}
                                <td className="px-6 py-2.5">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-white italic uppercase tracking-tight group-hover:text-primary-400 transition-colors">{level.name}</span>
                                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-[0.3em] opacity-60">Nivel {index + 1}</span>
                                    </div>
                                </td>
                                {/* Umbral */}
                                <td className="px-6 py-2.5">
                                    <div className="relative group/input max-w-[120px]">
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black text-primary-500 uppercase tracking-widest pointer-events-none opacity-40 group-focus-within/input:opacity-100 transition-opacity">PTS</div>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-2 text-xs text-white font-bold focus:outline-none focus:border-primary-500/50 hover:border-white/10 transition-all text-center"
                                            value={level.minPoints}
                                            onChange={(e) => onUpdateLevel(index, e.target.value)}
                                        />
                                    </div>
                                </td>
                                {/* Esfuerzo */}

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="px-8 py-6 bg-slate-900/50 border border-white/5 rounded-3xl shadow-xl backdrop-blur-md">
                <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">


                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto justify-center ">
                        <button
                            onClick={onRefreshRanking}
                            disabled={saving}
                            className="flex items-center justify-center gap-3 px-6 py-3.5 bg-slate-950 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] italic shadow-lg border border-white/5 hover:bg-white/5 transition-all active:scale-95 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${saving ? 'animate-spin' : ''}`} />
                            <span>Sincronizar Ranking</span>
                        </button>

                        <button
                            onClick={onSave}
                            disabled={saving}
                            className="flex items-center justify-center gap-3 px-8 py-3.5 bg-primary-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-lg shadow-primary-500/20 hover:bg-primary-500 transition-all active:scale-95 disabled:opacity-50 border border-primary-500/20"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>Guardar Configuración</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
