import React, { useState, useEffect } from 'react';
import { 
    Bell, 
    Send, 
    Users, 
    Building2, 
    Shield, 
    Info,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ExternalLink,
    ChevronRight,
    Search
} from 'lucide-react';
import AdminHeader from '../components/admin/AdminHeader';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminNotifications() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        type: 'info',
        link_url: '',
        scope: 'all', // all, department, role
        department: '',
        role: ''
    });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${API_URL}/departments`);
            if (response.data.success) {
                setDepartments(response.data.departments);
            }
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.message) {
            toast.error('Título y mensaje son obligatorios');
            return;
        }

        try {
            setSending(true);
            const filters = {};
            if (formData.scope === 'department' && formData.department) {
                filters.department = formData.department;
            } else if (formData.scope === 'role' && formData.role) {
                filters.role = formData.role;
            }

            const payload = {
                title: formData.title,
                message: formData.message,
                type: formData.type,
                link_url: formData.link_url || null,
                filters: Object.keys(filters).length > 0 ? filters : null
            };

            const response = await axios.post(`${API_URL}/notifications/send`, payload);
            
            if (response.data.success) {
                toast.success(response.data.message);
                // Reset form
                setFormData({
                    ...formData,
                    title: '',
                    message: '',
                    link_url: ''
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error al enviar notificaciones');
        } finally {
            setSending(false);
        }
    };

    const notificationTypes = [
        { id: 'info', label: 'Información', icon: Info, color: 'text-primary-400', bg: 'bg-primary-500/10' },
        { id: 'success', label: 'Éxito', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
        { id: 'warning', label: 'Advertencia', icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
        { id: 'danger', label: 'Peligro', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' }
    ];

    const roles = [
        { id: 'user', label: 'Estudiante (User)' },
        { id: 'analyst', label: 'Analista' },
        { id: 'admin', label: 'Administrador' }
    ];

    return (
        <div className="pb-20 animate-fade-in">
            <AdminHeader 
                title="Notificaciones Manuales" 
                subtitle="Envía mensajes directos a la campana de notificaciones de los usuarios."
            />

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Step 1: Content */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-primary-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">1. Contenido de la Notificación</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">¿Qué quieres comunicar?</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Título</label>
                                    <input 
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="Ej: Nuevo material disponible"
                                        className="w-full px-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary-500 transition-all placeholder:text-gray-600 font-medium"
                                    />
                                </div>

                                <div className="space-y-4 md:col-span-2">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mensaje Detallado</label>
                                    <textarea 
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        placeholder="Escribe el cuerpo de la notificación aquí..."
                                        rows="4"
                                        className="w-full px-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary-500 transition-all placeholder:text-gray-600 resize-none font-medium"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Enlace Opcional (URL)</label>
                                    <div className="relative">
                                        <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input 
                                            type="text"
                                            value={formData.link_url}
                                            onChange={(e) => setFormData({...formData, link_url: e.target.value})}
                                            placeholder="/dashboard o https://..."
                                            className="w-full pl-12 pr-5 py-4 bg-slate-800/50 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary-500 transition-all placeholder:text-gray-600 text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Tipo de Notificación</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {notificationTypes.map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setFormData({...formData, type: type.id})}
                                                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                                                    formData.type === type.id 
                                                        ? `${type.bg} border-primary-500/50 ${type.color}` 
                                                        : 'bg-white/5 border-transparent text-gray-500 hover:bg-white/10'
                                                }`}
                                            >
                                                <type.icon className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Segmentation */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden">
                        <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-secondary-500/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-secondary-500" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">2. Segmentación de Usuarios</h3>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">¿A quién va dirigida?</p>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, scope: 'all'})}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                                        formData.scope === 'all' 
                                            ? 'bg-primary-500/20 border-primary-500 text-white' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                                >
                                    <Users className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Todos</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, scope: 'department'})}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                                        formData.scope === 'department' 
                                            ? 'bg-primary-500/20 border-primary-500 text-white' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                                >
                                    <Building2 className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Por Área</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({...formData, scope: 'role'})}
                                    className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                                        formData.scope === 'role' 
                                            ? 'bg-primary-500/20 border-primary-500 text-white' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                                >
                                    <Shield className="w-6 h-6" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Por Rol</span>
                                </button>
                            </div>

                            {/* Dynamic Filters */}
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                {formData.scope === 'department' && (
                                    <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Seleccionar Área Institucional</label>
                                        <select 
                                            required
                                            value={formData.department}
                                            onChange={(e) => setFormData({...formData, department: e.target.value})}
                                            className="w-full px-5 py-4 bg-slate-800 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-primary-500 transition-all font-medium"
                                        >
                                            <option value="">Seleccione un área...</option>
                                            {departments.map(dep => (
                                                <option key={dep.id} value={dep.name}>{dep.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {formData.scope === 'role' && (
                                    <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Seleccionar Rol de Usuario</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {roles.map(role => (
                                                <button
                                                    key={role.id}
                                                    type="button"
                                                    onClick={() => setFormData({...formData, role: role.id})}
                                                    className={`p-4 rounded-2xl border text-center transition-all ${
                                                        formData.role === role.id 
                                                            ? 'bg-secondary-500/20 border-secondary-500 text-secondary-500' 
                                                            : 'bg-slate-800 border-white/5 text-gray-500 hover:bg-slate-700'
                                                    }`}
                                                >
                                                    <span className="text-[10px] font-black uppercase">{role.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {formData.scope === 'all' && (
                                    <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/20 flex items-start gap-4">
                                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-blue-200 font-medium">Esta notificación se enviará a todos los usuarios activos del sistema sin excepción.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            type="submit"
                            disabled={sending}
                            className="group relative w-full max-w-md py-6 bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-600 bg-[length:200%_auto] hover:bg-right text-white rounded-3xl font-black uppercase tracking-[0.3em] text-xs transition-all shadow-2xl shadow-primary-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            {sending ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Enviar Notificaciones</span>
                                    <Send className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </>
                            )}
                        </button>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Esta acción no se puede deshacer una vez enviada.</p>
                    </div>
                </form>
            </div>
        </div>
    );
}
