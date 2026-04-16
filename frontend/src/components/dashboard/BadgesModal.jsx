import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Shield, Lock, Trophy } from 'lucide-react';

export default function BadgesModal({ isOpen, onClose, badges }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl pointer-events-auto"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-4xl bg-[#0B0F1C] border border-white/5 rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Decorative background Elements */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        {/* Header */}
                        <div className="relative p-8 md:p-12 border-b border-white/5 flex items-center justify-between z-10">
                            <div className="text-left">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-primary-500/20 rounded-xl">
                                        <Trophy className="w-5 h-5 text-primary-400" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">Mis Insignias</h2>
                                </div>
                                <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Tu colección de logros y reconocimientos en la plataforma</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                            >
                                <X className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Badges Grid */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar z-10">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                                {Array.isArray(badges) && badges.map((badge, i) => (
                                    <motion.div
                                        key={badge.id || i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group relative flex flex-col gap-4 text-center"
                                    >
                                        <div className="aspect-square rounded-3xl bg-slate-900 border border-white/5 flex items-center justify-center relative cursor-default shadow-2xl transition-all duration-500 hover:border-primary-500/40 hover:shadow-primary-500/5 hover:-translate-y-1 group/badge ">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"></div>
                                            <img
                                                src={badge.image_url ? (badge.image_url.startsWith('http') ? badge.image_url : `/images/badges/${badge.image_url}`) : '/images/shield.svg'}
                                                alt={badge.name}
                                                className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover/badge:scale-110 drop-shadow-[0_0_20px_rgba(56,74,153,0.3)]"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/images/shield.svg';
                                                }}
                                            />

                                            {/* Badge Tooltip Detail on Click/Hover */}
                                            <div className="absolute inset-0 bg-slate-900/95 p-4 rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300 pointer-events-none text-center">
                                                <p className="text-[10px] font-black text-secondary-500 uppercase tracking-widest mb-1">{badge.name}</p>
                                                <p className="text-[9px] text-gray-300 font-medium leading-tight line-clamp-4">{badge.description}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-[11px] font-bold text-white uppercase tracking-tight group-hover:text-primary-400 transition-colors px-1 line-clamp-3 min-h-[2.8rem] leading-[1.2] text-center pt-1">
                                                {badge.name}
                                            </p>
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                                                {new Date(badge.earned_at || badge.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Locked Placeholders */}
                                {[...Array(Math.max(0, 10 - (badges?.length || 0)))].map((_, i) => (
                                    <div key={`locked-${i}`} className="flex flex-col gap-4 opacity-10 grayscale">
                                        <div className="aspect-square rounded-3xl bg-slate-950 border border-white/5 flex items-center justify-center relative shadow-inner">
                                            <Shield className="w-12 h-12 text-slate-800" />
                                            <Lock className="w-5 h-5 absolute top-4 right-4 text-slate-800" />
                                        </div>
                                        <div className="text-center opacity-50">
                                            <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Bloqueada</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 bg-white/5 border-t border-white/5 text-center flex items-center justify-center gap-6 z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(56,74,153,0.8)]" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Insignias Ganadas: {badges?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-slate-800" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pendientes: {Math.max(0, 24 - (badges?.length || 0))}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
