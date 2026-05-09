import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Award, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CertificatesModal({ isOpen, onClose, certificates }) {
    const navigate = useNavigate();

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
                        className="relative w-full max-w-4xl bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-300"
                    >
                        {/* Decorative background Elements */}
                        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        {/* Header */}
                        <div className="relative p-8 md:p-12 border-b border-white/5 flex items-center justify-between z-10">
                            <div className="text-left">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-secondary-500/20 rounded-xl">
                                        <Award className="w-5 h-5 text-secondary-500" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-[var(--text-color)] uppercase tracking-tight text-left">Mis Certificados</h2>
                                </div>
                                <p className="text-gray-500 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Certificados obtenidos en la plataforma</p>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors group"
                            >
                                <X className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                            </button>
                        </div>

                        {/* Certificates List */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar z-10">
                            {certificates && certificates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {certificates.map((cert, i) => (
                                        <motion.div
                                            key={cert.id || i}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            onClick={() => {
                                                onClose();
                                                navigate(`/certificates/module/${cert.module_id}`, { state: { from: '/dashboard', openCertificates: true } });
                                            }}
                                            className="p-5 rounded-2xl bg-[var(--bg-color)] border border-[var(--card-border)] hover:border-secondary-500/40 hover:bg-[var(--bg-color)]/80 transition-all cursor-pointer group text-left flex items-center gap-4 shadow-lg hover:shadow-secondary-500/10 hover:-translate-y-1"
                                        >
                                            <div className="p-3 bg-secondary-500/20 rounded-xl text-secondary-500 group-hover:scale-110 transition-transform">
                                                <FileText className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[var(--text-color)] font-bold text-sm uppercase tracking-tight group-hover:text-secondary-400 transition-colors line-clamp-2">{cert.module_title}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                    Obtenido: {new Date(cert.issued_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-secondary-500" />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="p-6 bg-slate-800/30 rounded-full mb-4">
                                        <Award className="w-16 h-16 text-gray-600 opacity-50" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-400 uppercase tracking-tight mb-2">Aún no tienes certificaciones</h3>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest max-w-sm">Completa los módulos del programa para obtener tus primeros títulos oficiales.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 bg-white/5 border-t border-white/5 text-center flex items-center justify-center gap-6 z-10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-secondary-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Certificados: {certificates?.length || 0}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
