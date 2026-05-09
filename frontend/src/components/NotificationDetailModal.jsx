import React from 'react';
import { createPortal } from 'react-dom';
import { X, Bell, Info, CheckCircle2, Cpu, Terminal, Zap, ExternalLink, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CyberCat from './CyberCat';

const NotificationDetailModal = ({ notification, onClose }) => {
    const navigate = useNavigate();
    
    // Si no hay notificación, no renderizamos nada
    if (!notification) return null;

    const handleAction = () => {
        if (notification.link_url) {
            // Abrir en nueva pestaña como solicitó el usuario
            window.open(notification.link_url, '_blank', 'noopener,noreferrer');
            onClose();
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-400 border-green-500/50';
            case 'warning': return 'text-yellow-400 border-yellow-500/50';
            case 'danger': return 'text-red-400 border-red-500/50';
            default: return 'text-primary-400 border-primary-500/50';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-CR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const modalContent = (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/95 backdrop-blur-md"
                >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
                </motion.div>

                {/* Modal Container */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg my-auto"
                >
                    {/* Decoration: Tech HUD Rings (Optional but cool) */}
                    <div className="absolute -inset-10 pointer-events-none opacity-20 hidden md:block">
                        <div className="absolute inset-0 border-[1px] border-primary-500/30 rounded-full animate-spin-slow"></div>
                        <div className="absolute inset-10 border-[1px] border-secondary-500/20 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
                    </div>

                    <div className="bg-[#0b0f1d] border-2 border-primary-500/40 rounded-none overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.7),inset_0_0_30px_rgba(56,74,153,0.15)] relative">
                        {/* HUD Corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-secondary-500 opacity-60"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-secondary-500 opacity-60"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-secondary-500 opacity-60"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-secondary-500 opacity-60"></div>

                        {/* Top Bar */}
                        <div className="h-14 bg-gradient-to-r from-primary-900/80 via-slate-900 to-primary-900/80 border-b border-primary-500/30 flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className="w-1 h-3 bg-secondary-500"></div>
                                    <div className="w-1 h-3 bg-secondary-500/40"></div>
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] font-mono">NOTIF.DETAILS.log</span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 pt-10">
                            {/* Icon & Title Header */}
                            <div className="flex items-start gap-6 mb-8">
                                <div className={`w-16 h-16 rounded-none border-2 flex items-center justify-center shrink-0 bg-slate-900/50 shadow-[0_0_20px_rgba(0,0,0,0.3)] ${getIconColor(notification.notification_type)}`}>
                                    <Bell className="w-8 h-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-3 h-3 text-gray-500" />
                                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                            {formatDate(notification.created_at)}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter leading-tight italic line-clamp-2">
                                        {notification.title}
                                    </h2>
                                </div>
                            </div>

                            {/* Message Content */}
                            <div className="bg-slate-900/60 border border-white/5 p-6 mb-8 relative group">
                                <div className="absolute top-0 right-0 w-8 h-8 bg-primary-500/5 rotate-45 translate-x-4 -translate-y-4"></div>
                                <p className="text-gray-300 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                                    {notification.message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4">
                                {notification.link_url && (
                                    <button
                                        onClick={handleAction}
                                        className="w-full group relative overflow-hidden py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-none font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-500/20"
                                    >
                                        VER CONTENIDO RELACIONADO <ExternalLink className="w-4 h-4" />
                                    </button>
                                )}

                                <button
                                    onClick={onClose}
                                    className="w-full py-4 bg-transparent text-gray-400 hover:text-white rounded-none font-black uppercase tracking-[0.3em] text-[11px] transition-all border border-white/10 hover:border-white/30"
                                >
                                    CERRAR
                                </button>
                            </div>
                        </div>

                        {/* Footer decorative bar */}
                        <div className="flex h-1 w-full opacity-50">
                            <div className="flex-1 bg-primary-500"></div>
                            <div className="flex-1 bg-secondary-500"></div>
                            <div className="flex-1 bg-primary-500"></div>
                        </div>
                    </div>

                    {/* CyberCat Mini-Mascot Floating */}
                    <div className="absolute -bottom-6 -right-6 z-20">
                        <div className="bg-[#1a2245] p-1.5 border border-primary-500/30 shadow-2xl">
                            <CyberCat className="w-12 h-12" color="#E57B3C" variant="static" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
};

export default NotificationDetailModal;
