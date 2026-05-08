import React, { useState, useEffect, useMemo } from 'react';
import { X, Users, Search, Filter, CheckCircle2, Circle, Loader2, Mail, Briefcase, Building2 } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function ComplianceDetailModal({ isOpen, onClose, areaType, areaName, moduleId }) {
    const [loading, setLoading] = useState(true);
    const [staff, setStaff] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, completed, pending

    useEffect(() => {
        if (isOpen && areaType && areaName) {
            fetchDetail();
        }
    }, [isOpen, areaType, areaName, moduleId]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/reports/area-compliance-detail`, {
                params: { type: areaType, name: areaName, module_id: moduleId }
            });
            if (response.data.success) {
                setStaff(response.data.staff);
            }
        } catch (error) {
            console.error('Error fetching area detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = useMemo(() => {
        return staff.filter(person => {
            const matchesSearch = 
                person.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                person.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesFilter = 
                filter === 'all' || 
                (filter === 'completed' && person.is_completed) ||
                (filter === 'pending' && !person.is_completed);

            return matchesSearch && matchesFilter;
        });
    }, [staff, searchTerm, filter]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#0B0F1A] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-zoom-in">
                
                {/* Header */}
                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-primary-500/5 to-transparent">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-primary-500/10 rounded-2xl flex items-center justify-center border border-primary-500/20 shadow-lg shadow-primary-500/5">
                                <Users className="w-7 h-7 text-primary-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">
                                    Detalle de Cumplimiento
                                </h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-primary-500/10">
                                        {areaType === 'departments' ? 'Unidad/Área' : (areaType === 'positions' ? 'Puesto' : 'Módulo')}
                                    </span>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        {areaName}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all border border-white/5 active:scale-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input 
                                type="text"
                                placeholder="Buscar por nombre o correo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 transition-all"
                            />
                        </div>

                        <div className="flex items-center bg-slate-900/50 border border-white/5 rounded-xl p-1">
                            {[
                                { id: 'all', label: 'Todos', icon: Users },
                                { id: 'completed', label: 'Completados', icon: CheckCircle2 },
                                { id: 'pending', label: 'Pendientes', icon: Circle }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    onClick={() => setFilter(opt.id)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                                        ${filter === opt.id ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' : 'text-gray-500 hover:text-gray-300'}
                                    `}
                                >
                                    <opt.icon className="w-3.5 h-3.5" />
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* List Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-950/20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="relative">
                                <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                                <div className="absolute inset-0 blur-xl bg-primary-500/20 animate-pulse"></div>
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">Consultando directorio...</p>
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                            <Search className="w-16 h-16 text-gray-600 mb-4" />
                            <p className="text-gray-500 font-black uppercase tracking-widest">No se encontraron resultados</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {filteredStaff.map((person, idx) => (
                                <div 
                                    key={idx}
                                    className="group flex items-center justify-between p-4 bg-slate-900/30 border border-white/5 rounded-2xl hover:bg-slate-900/50 hover:border-primary-500/20 transition-all duration-300 animate-fade-in"
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`
                                            w-10 h-10 rounded-xl flex items-center justify-center border
                                            ${person.is_completed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-800/50 border-white/5'}
                                        `}>
                                            {person.is_completed ? (
                                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">
                                                {person.full_name}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-1 opacity-60">
                                                <div className="flex items-center gap-1.5">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="text-[10px] font-medium">{person.email}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Briefcase className="w-3 h-3" />
                                                    <span className="text-[10px] font-medium truncate max-w-[150px]">{person.position}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="flex items-center gap-2 justify-end mb-1">
                                            <span className={`text-[11px] font-black ${person.is_completed ? 'text-emerald-400' : 'text-gray-400'}`}>
                                                {person.progress}%
                                            </span>
                                        </div>
                                        <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${person.is_completed ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-600'}`}
                                                style={{ width: `${person.progress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mt-1.5">
                                            {moduleId === 'ALL' ? `${person.completed_modules}/${person.total_modules} Módulos` : (person.is_completed ? 'Completado' : 'Pendiente')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#0B0F1A] border-t border-white/5 flex items-center justify-between">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Mostrando {filteredStaff.length} de {staff.length} funcionarios
                    </p>
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5 active:scale-95"
                    >
                        Cerrar Detalle
                    </button>
                </div>
            </div>
        </div>
    );
}
