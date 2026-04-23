import React from 'react';
import { Edit2, Trash2, Gift } from 'lucide-react';

export default function BadgeGrid({ badges, onEdit, onDelete, onAward }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {badges.map((badge) => {
                return (
                    <div key={badge.id} className="card group p-8 bg-slate-900/40 border-white/5 hover:border-primary-500/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-bl-full blur-3xl group-hover:bg-primary-500/10 transition-all"></div>

                        <div className="flex items-start justify-between mb-8 relative">
                            <div className="w-20 h-20 rounded-[2.5rem] bg-slate-950 border border-white/10 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 shadow-2xl overflow-hidden p-2">
                                <div className="absolute inset-0 bg-primary-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img 
                                    src={`/images/badges/${badge.image_url || 'inicio-seguridad.svg'}`} 
                                    className="w-full h-full object-contain relative z-10" 
                                    alt={badge.name}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onAward(badge)}
                                    className="p-3 bg-primary-500/10 rounded-xl text-primary-400 hover:text-white hover:bg-primary-500/20 transition-all"
                                    title="Otorgar a usuario"
                                >
                                    <Gift className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onEdit(badge)}
                                    className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                                    title="Editar"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(badge)}
                                    className="p-3 bg-red-500/5 rounded-xl text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 relative text-left">
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">{badge.name}</h3>
                                {badge.points > 0 && (
                                    <div className="inline-flex mt-2 items-center gap-1.5 px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{badge.points} Puntos</span>
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 font-medium leading-relaxed mt-2">{badge.description}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
