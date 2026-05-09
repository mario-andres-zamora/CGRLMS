import React, { useState } from 'react';
import { Bell, Check, Trash2, ExternalLink, Calendar, Search, Filter } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import NotificationDetailModal from '../components/NotificationDetailModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function Notifications() {
    const { notifications, markAsRead, markAllAsRead, loading } = useNotificationStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [selectedNotification, setSelectedNotification] = useState(null);

    const filteredNotifications = notifications.filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             n.message.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'unread') return matchesSearch && !n.is_read;
        if (filter === 'read') return matchesSearch && n.is_read;
        return matchesSearch;
    });

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'danger': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-primary-400 bg-primary-500/10 border-primary-500/20';
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 animate-fade-in">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-primary-500/20 rounded-2xl border border-primary-500/30">
                            <Bell className="w-8 h-8 text-primary-400" />
                        </div>
                        Centro de Notificaciones
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2 ml-1">Historial completo de tus avisos, logros y alertas del sistema.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border border-white/5 flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Marcar todo leído
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <div className="lg:col-span-2 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                        type="text"
                        placeholder="Buscar en tus notificaciones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2rem] text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                    />
                </div>
                <div className="flex bg-slate-900/50 backdrop-blur-md p-1.5 rounded-[2rem] border border-white/5">
                    {['all', 'unread', 'read'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === f 
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                                    : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            {f === 'all' ? 'Todas' : f === 'unread' ? 'No leídas' : 'Leídas'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {filteredNotifications.length === 0 ? (
                    <div className="py-20 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5">
                        <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="w-10 h-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-400">No hay notificaciones</h3>
                        <p className="text-gray-500 text-sm mt-2">No hemos encontrado mensajes que coincidan con tu búsqueda.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        <AnimatePresence mode="popLayout">
                            {filteredNotifications.map((notif) => (
                                <motion.div
                                    key={notif.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedNotification(notif);
                                        if (!notif.is_read) markAsRead(notif.id);
                                    }}
                                    className={`group relative p-6 bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2rem] cursor-pointer hover:bg-slate-800/50 transition-all ${
                                        !notif.is_read ? 'ring-1 ring-primary-500/30' : ''
                                    }`}
                                >
                                    {!notif.is_read && (
                                        <div className="absolute right-6 top-6 w-2 h-2 bg-primary-500 rounded-full shadow-[0_0_10px_rgba(56,74,153,0.8)]"></div>
                                    )}

                                    <div className="flex gap-6 items-start">
                                        <div className={`shrink-0 w-14 h-14 rounded-2xl border flex items-center justify-center ${getIconColor(notif.notification_type)}`}>
                                            <Bell className="w-6 h-6" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                <h4 className={`text-lg font-black uppercase tracking-tight ${!notif.is_read ? 'text-white' : 'text-gray-400'}`}>
                                                    {notif.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(notif.created_at).toLocaleDateString('es-CR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                            
                                            <p className={`text-sm leading-relaxed mb-4 ${!notif.is_read ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {notif.message}
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-3 py-1.5 rounded-full border border-primary-500/20">
                                                    Ver detalles completos
                                                    <ExternalLink className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <NotificationDetailModal 
                notification={selectedNotification}
                onClose={() => setSelectedNotification(null)}
            />
        </div>
    );
}
