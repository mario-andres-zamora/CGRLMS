import React, { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Mail, ChevronLeft, ChevronRight, Send, Search } from 'lucide-react';

export default function RiskAlerts({ 
    atRisk = [], 
    departments = [], 
    onSendReminders, 
    onSendRiskReminders, 
    onSendIndividualRiskReminder 
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const itemsPerPage = 6;

    // Filtered items based on search
    const filteredAtRisk = useMemo(() => {
        const search = searchTerm.toLowerCase();
        return atRisk.filter(user => 
            `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(search) ||
            (user.department || '').toLowerCase().includes(search) ||
            (user.email || '').toLowerCase().includes(search)
        );
    }, [atRisk, searchTerm]);

    const totalPages = Math.ceil(filteredAtRisk.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredAtRisk.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Ensure current page is valid when data changes
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="card bg-red-500/5 border-red-500/20 p-8 space-y-6 relative overflow-hidden group text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full blur-[80px] group-hover:bg-red-500/20 transition-all pointer-events-none"></div>

            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-red-400 uppercase tracking-tight flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                        Alertas de Riesgo
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                        Listado de funcionarios con avance crítico (<span className="text-red-400 font-bold">menos del 20%</span>).
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative group/search">
                        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors group-focus-within/search:text-red-400" />
                        <input
                            type="text"
                            placeholder="Buscar en riesgo..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="bg-slate-950/50 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-[10px] font-bold text-white w-full md:w-64 focus:outline-none focus:border-red-500/30 transition-all"
                        />
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center gap-3 bg-slate-950/50 p-2 rounded-xl border border-white/5 shadow-inner">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentPage(prev => Math.max(prev - 1, 1));
                                }}
                                disabled={currentPage === 1}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    currentPage === 1 
                                        ? 'opacity-10 cursor-not-allowed text-gray-600' 
                                        : 'hover:bg-red-500/20 text-red-400 active:scale-90 cursor-pointer'
                                }`}
                                aria-label="Página anterior"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <div className="flex flex-col items-center min-w-[70px]">
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                                    Pág {currentPage}
                                </span>
                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-[-2px]">
                                    de {totalPages}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                }}
                                disabled={currentPage === totalPages}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                    currentPage === totalPages 
                                        ? 'opacity-10 cursor-not-allowed text-gray-600' 
                                        : 'hover:bg-red-500/20 text-red-400 active:scale-90 cursor-pointer'
                                }`}
                                aria-label="Siguiente página"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/30">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="px-4 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest">Funcionario</th>
                            <th className="px-4 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">Unidad</th>
                            <th className="px-4 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest text-center">Avance</th>
                            <th className="px-4 py-3 text-[8px] font-black text-gray-400 uppercase tracking-widest text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {paginatedItems.length > 0 ? paginatedItems.map((user, idx) => (
                            <tr key={idx} className="hover:bg-red-500/5 transition-colors">
                                <td className="px-4 py-3">
                                    <p className="text-[10px] font-black text-white uppercase">{user.first_name} {user.last_name}</p>
                                    <p className="text-[8px] text-gray-500 font-bold uppercase sm:hidden">{user.department}</p>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <p className="text-[9px] text-gray-400 font-black uppercase italic">{user.department}</p>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className="text-[11px] font-black text-red-500">{Math.round(user.progress)}%</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => onSendIndividualRiskReminder(user)}
                                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all duration-300 group/btn shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                                        title="Enviar alerta de riesgo individual"
                                    >
                                        <Send className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="py-10 text-center space-y-3">
                                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest italic font-medium">Bajo control: 0 alertas</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* At Risk Mass Reminder */}
                <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Recordatorios de Riesgo</h4>
                    </div>
                    <p className="text-[9px] text-gray-500 font-bold italic leading-relaxed">
                        Enviar alerta a todos los funcionarios que tienen <span className="text-red-400">menos del 20%</span> de avance y que ya están registrados.
                    </p>
                    <button
                        onClick={() => onSendRiskReminders(filteredAtRisk)}
                        disabled={filteredAtRisk.length === 0}
                        className={`w-full py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${filteredAtRisk.length > 0
                                ? 'bg-red-500 text-white hover:bg-red-400 shadow-red-500/20'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                    >
                        <Mail className="w-4 h-4" /> Notificar a los {filteredAtRisk.length} en riesgo
                    </button>
                </div>

                {/* Unregistered Invitations */}
                <div className="space-y-4 p-5 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-4 h-4 text-primary-400" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Invitaciones Pendientes</h4>
                    </div>
                    <div className="relative">
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white focus:outline-none focus:border-primary-500/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="">-- Seleccionar Área --</option>
                            {departments.map((dept, idx) => (
                                <option key={idx} value={dept.department}>{dept.department}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={() => onSendReminders(selectedDept)}
                        disabled={!selectedDept}
                        className={`w-full py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${selectedDept
                                ? 'bg-primary-500 text-white hover:bg-primary-400 shadow-primary-500/20'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                    >
                        <Mail className="w-4 h-4" /> Invitar No Registrados
                    </button>
                </div>
            </div>
        </div>
    );
}