import { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink } from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';
import { useNavigate } from 'react-router-dom';
import NotificationDetailModal from './NotificationDetailModal';

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        if (!notification.is_read) {
            markAsRead(notification.id);
        }
        setIsOpen(false);
        setSelectedNotification(notification);
    };

    const handleModalAction = (url) => {
        setSelectedNotification(null);
        if (url) {
            navigate(url);
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'success': return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'warning': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'danger': return 'text-red-400 bg-red-500/10 border-red-500/20';
            default: return 'text-primary-400 bg-primary-500/10 border-primary-500/20';
        }
    };

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                {/* Bell Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative p-2 rounded-xl transition-all duration-300 ${
                        isOpen || unreadCount > 0
                            ? 'bg-primary-500/20 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-[wiggle_1s_ease-in-out_infinite]' : ''}`} />
                    
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white shadow-lg shadow-red-500/50 ring-2 ring-[#0d1127]">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>

                {/* Dropdown Panel */}
                {isOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 z-[100] overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                                Notificaciones
                                {unreadCount > 0 && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-primary-500/20 text-primary-400 text-[10px] tracking-normal">
                                        {unreadCount} nuevas
                                    </span>
                                )}
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAllAsRead();
                                    }}
                                    className="text-[10px] font-bold text-gray-400 hover:text-primary-400 uppercase tracking-wider transition-colors"
                                >
                                    Marcar todo leído
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
                                        <Bell className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-400">No tienes notificaciones</p>
                                    <p className="text-xs text-gray-500 mt-1">Aquí verás tus logros y avisos importantes.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`group relative p-4 hover:bg-white/[0.02] cursor-pointer transition-colors ${
                                                !notif.is_read ? 'bg-primary-500/[0.03]' : ''
                                            }`}
                                        >
                                            {!notif.is_read && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 shadow-[0_0_10px_rgba(56,74,153,0.5)]" />
                                            )}
                                            
                                            <div className="flex gap-3">
                                                <div className={`mt-1 w-8 h-8 rounded-full border flex items-center justify-center shrink-0 ${getIconColor(notif.notification_type)}`}>
                                                    <Bell className="w-3.5 h-3.5" />
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className={`text-sm font-bold truncate ${!notif.is_read ? 'text-white' : 'text-gray-300'}`}>
                                                            {notif.title}
                                                        </h4>
                                                        <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap shrink-0">
                                                            {new Date(notif.created_at).toLocaleDateString('es-CR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    
                                                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                                                        {notif.message}
                                                    </p>
                                                    
                                                    <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-primary-400 uppercase tracking-wider">
                                                        <span>Ver detalles</span>
                                                        <ExternalLink className="w-3 h-3" />
                                                    </div>
                                                </div>

                                                {!notif.is_read && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            markAsRead(notif.id);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all shrink-0 self-center"
                                                        title="Marcar como leído"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="px-4 py-2 border-t border-white/5 bg-slate-900/50 text-center">
                            <button
                                onClick={() => { setIsOpen(false); navigate('/notifications'); }}
                                className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                            >
                                Ver historial completo
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <NotificationDetailModal 
                notification={selectedNotification}
                onClose={() => setSelectedNotification(null)}
            />
        </>
    );
}
