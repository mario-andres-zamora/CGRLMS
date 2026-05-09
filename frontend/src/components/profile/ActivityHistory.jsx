import React from 'react';
import { 
    History as HistoryIcon, 
    PlayCircle, 
    Trophy, 
    Shield, 
    Star, 
    Calendar, 
    ChevronRight 
} from 'lucide-react';

export default function ActivityHistory({ 
    activities, 
    currentPage, 
    activitiesPerPage, 
    onPageChange, 
    onActivityClick 
}) {
    const totalPages = Math.ceil(activities.length / activitiesPerPage);
    const displayedActivities = activities.slice(
        (currentPage - 1) * activitiesPerPage, 
        currentPage * activitiesPerPage
    );

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[var(--text-color)] uppercase tracking-tight flex items-center gap-3">
                <HistoryIcon className="w-6 h-6 text-primary-400" />
                Historial de Actividad
            </h2>

            <div className="space-y-2">
                {activities.length > 0 ? (
                    <>
                        {displayedActivities.map((activity, index) => (
                            <div
                                key={index}
                                onClick={() => onActivityClick(activity)}
                                className={`group p-3 rounded-[1.2rem] transition-all flex items-center gap-4 
                                    ${activity.type === 'module_completed'
                                        ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                        : 'bg-[var(--card-bg)] border-[var(--card-border)]'} 
                                    border ${activity.reference_id ? 'cursor-pointer hover:bg-[var(--card-bg)]/80 hover:border-primary-500/30' : ''}`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                                    activity.type === 'lesson_completed' ? 'bg-blue-500/10 text-blue-400' :
                                    activity.type === 'quiz_passed' ? 'bg-orange-500/10 text-orange-400' :
                                    activity.type === 'phishing_reported' ? 'bg-green-500/10 text-green-400' :
                                    activity.type === 'module_completed' ? 'bg-amber-500/20 text-amber-500' :
                                    'bg-purple-500/10 text-purple-400'
                                }`}>
                                    {activity.type === 'lesson_completed' ? <PlayCircle className="w-5 h-5" /> :
                                        activity.type === 'quiz_passed' ? <Trophy className="w-5 h-5" /> :
                                            activity.type === 'phishing_reported' ? <Shield className="w-5 h-5" /> :
                                                <Star className="w-5 h-5" />}
                                </div>

                                <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
                                    <div className="space-y-0.5 flex-1 pr-4 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 px-1.5 py-0.5 bg-white/5 rounded-md border border-white/5 whitespace-nowrap">
                                                {activity.type === 'lesson_completed' ? 'LECCIÓN' :
                                                    activity.type === 'quiz_passed' ? 'EXAMEN' :
                                                        activity.type === 'module_completed' ? 'MÓDULO' :
                                                            activity.type === 'phishing_reported' ? 'PHISHING' :
                                                                'ACTIVIDAD'}
                                            </span>
                                            {activity.module_id && (
                                                <span className="text-[8px] font-black uppercase tracking-widest text-primary-500/70 whitespace-nowrap">
                                                    Módulo {activity.module_id}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[var(--text-color)] font-bold text-sm tracking-tight text-left">
                                            {activity.type === 'module_completed' ? `¡Completaste el módulo: ${activity.reference_title}!` :
                                                activity.type === 'lesson_completed' ? `¡Completaste la lección: ${activity.reference_title}!` :
                                                    activity.type === 'quiz_passed' ? `¡Aprobaste la evaluación: ${activity.reference_title}!` :
                                                        activity.reference_title}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right flex flex-col items-end">
                                            <span className={`text-[10px] font-black italic tracking-tighter ${activity.type === 'module_completed' ? 'text-amber-500' : 'text-primary-400'}`}>
                                                +{activity.points_earned || 0} Puntos
                                            </span>
                                            <p className="text-[9px] text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </p>
                                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">
                                                {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-800 group-hover:text-primary-400 transition-colors hidden md:block" />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination Controls */}
                        {activities.length > activitiesPerPage && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <button
                                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-xl bg-[var(--card-bg)] text-gray-400 text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:bg-[var(--card-bg)]/80 transition-colors border border-[var(--card-border)]"
                                >
                                    Anterior
                                </button>
                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => onPageChange(i + 1)}
                                            className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === i + 1
                                                ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20'
                                                : 'bg-[var(--card-bg)] border-[var(--card-border)] text-gray-500 hover:bg-[var(--card-bg)]/80'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-xl bg-[var(--card-bg)] text-gray-400 text-xs font-black uppercase tracking-widest disabled:opacity-20 hover:bg-[var(--card-bg)]/80 transition-colors border border-[var(--card-border)]"
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-20 text-center bg-[var(--card-bg)] rounded-3xl border border-dashed border-[var(--card-border)]">
                        <HistoryIcon className="w-16 h-16 text-gray-700 mx-auto mb-4 opacity-10" />
                        <h4 className="text-[var(--text-color)] font-bold opacity-30">Tu historial está vacío</h4>
                        <p className="text-gray-600 text-[11px] font-medium uppercase tracking-widest mt-1">Comienza tu capacitación para ganar puntos</p>
                    </div>
                )}
            </div>
        </div>
    );
}
