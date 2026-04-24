import { BookOpen, TrendingUp, Lock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import CyberCat from '../CyberCat';

export default function ModuleGrid({ modules }) {
    const navigate = useNavigate();

    return (
        <div className="bg-[#111627] p-8 rounded-3xl border border-white/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 text-left">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#6D71F9]/10 rounded-xl flex items-center justify-center border border-[#6D71F9]/20 text-[#6D71F9]">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-wider uppercase">
                        MI RUTA DE APRENDIZAJE
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                {modules.length > 0 ? (
                    modules.map((module) => (
                        <ModuleCard key={module.id} module={module} navigate={navigate} />
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center bg-[#0B0F1C] rounded-[2rem] border border-dashed border-white/5">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs opacity-60">
                            No hay módulos disponibles en este momento.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function ModuleCard({ module, navigate }) {
    const isLocked = module.is_locked;
    const isUpcoming = module.is_upcoming;
    const isCompleted = module.status === 'completed' || module.progress >= 100;

    const handleNavigation = () => {
        if (isLocked) {
            toast.error(module.lock_reason || 'Requisito de precedencia no cumplido.', { id: 'module-locked-warning' });
            return;
        }
        navigate(`/modules/${module.id}`);
    };

    const handleCardClick = (e) => {
        if (e.target.closest('button') || e.target.closest('a')) return;
        handleNavigation();
    };

    return (
        <div
            onClick={handleCardClick}
            className={`group relative flex flex-col p-6 rounded-[2rem] border transition-all cursor-pointer overflow-hidden shadow-2xl ${isCompleted
                    ? 'bg-emerald-500/[0.03] border-emerald-500/20 hover:border-emerald-500/40'
                    : isUpcoming
                        ? 'bg-slate-900/40 border-white/5 opacity-80 hover:opacity-100'
                        : 'bg-[#151B2E] border-white/5 hover:border-white/10'
                }`}
        >
            {/* Completion Badge Overlay */}
            {isCompleted && (
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-500/10 blur-2xl rounded-full"></div>
            )}

            <div className="flex justify-between items-start mb-6 relative z-10 min-h-[48px] text-left">
                <h3 className={`text-base font-bold leading-tight line-clamp-3 transition-colors ${isCompleted ? 'text-emerald-400' : isUpcoming ? 'text-gray-400' : 'text-white'
                    }`}>
                    {module.title}
                </h3>
                {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />}
            </div>

            <div className="mt-auto space-y-5 relative z-10">
                {isLocked ? (
                    <>
                        <motion.div
                            initial={{ opacity: 0.8 }}
                            animate={{ opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className={`w-full py-5 flex flex-col items-center justify-center gap-2 rounded-2xl border px-4 ${isUpcoming ? 'bg-slate-900/60 border-white/5 text-gray-600' : 'bg-orange-500/5 border-orange-500/10 text-orange-400/60'
                                }`}
                        >
                            <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.2em]">
                                {isUpcoming ? <CyberCat className="w-6 h-6 opacity-30" variant="static" color="#64748B" /> : <Lock className="w-3.5 h-3.5" />}
                                {isUpcoming ? 'Próximamente' : 'Bloqueado'}
                            </div>
                            {!isUpcoming && module.lock_reason && (
                                <p className="text-[10px] text-gray-600 font-medium leading-tight text-center max-w-[150px]">
                                    {module.lock_reason}
                                </p>
                            )}
                        </motion.div>

                        {isUpcoming && (
                            <div className="w-full py-3 rounded-xl bg-slate-800/40 text-gray-600 text-[9px] font-bold uppercase tracking-[0.2em] border border-white/5 flex items-center justify-center gap-2 cursor-not-allowed">
                                PRÓXIMAMENTE
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div className="space-y-2.5">
                            <div className="flex justify-between items-end text-[9px] font-bold uppercase tracking-widest">
                                <span className={isCompleted ? 'text-emerald-500/50' : 'text-gray-500'}>PROGRESO</span>
                                <span className={isCompleted ? 'text-emerald-400' : 'text-white'}>{module.progress || 0}%</span>
                            </div>
                            <div className={`h-1.5 rounded-full overflow-hidden ${isCompleted ? 'bg-emerald-950/30' : 'bg-slate-950'}`}>
                                <div
                                    className={`h-full transition-all duration-1000 shadow-sm ${isCompleted
                                            ? 'bg-gradient-to-r from-emerald-600 to-teal-500'
                                            : 'bg-gradient-to-r from-[#EF8843] to-[#E56B24]'
                                        }`}
                                    style={{ width: `${module.progress || 0}%` }}
                                ></div>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNavigation();
                            }}
                            className={`w-full py-3 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group/btn shadow-xl border ${isCompleted
                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                                    : 'bg-gradient-to-r from-[#EF8843] to-[#E56B24] text-white border-transparent shadow-orange-500/10'
                                }`}
                        >
                            {isCompleted ? (
                                <>FINALIZADO <CheckCircle2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" /></>
                            ) : (
                                <>EMPEZAR <TrendingUp className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" /></>
                            )}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
