import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Mail, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RiskAlerts({ atRisk, departments = [], onSendReminders }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDept, setSelectedDept] = useState('');
    const itemsPerPage = 5;

    const totalPages = Math.ceil(atRisk.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = atRisk.slice(startIndex, startIndex + itemsPerPage);

    const handleIndividualReminder = (username) => {
        toast.success(`Recordatorio enviado individualmente a: ${username}`, {
            icon: '📩',
            style: {
                borderRadius: '10px',
                background: '#0f172a',
                color: '#fff',
                border: '1px solid #ef444430',
                fontSize: '11px',
                fontWeight: 'bold'
            },
        });
    };

    return (
        <div className="card bg-red-500/5 border-red-500/20 p-8 space-y-6 relative overflow-hidden group text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-bl-full blur-[80px] group-hover:bg-red-500/20 transition-all"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-black text-red-400 uppercase tracking-tight flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 animate-pulse" />
                        Alertas de Riesgo
                    </h3>
                    <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                        Listado de funcionarios con avance crítico (<span className="text-red-400 font-bold">menos del 20%</span>).
                    </p>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center gap-3 bg-slate-950/50 p-1.5 rounded-xl border border-white/5">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`p-1 rounded-lg transition-all ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-red-500/20 text-red-400'}`}
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter">Pág {currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`p-1 rounded-lg transition-all ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : 'hover:bg-red-500/20 text-red-400'}`}
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
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
                    <tbody className="divide-y divide-white/5 block sm:table-row-group w-full max-h-[300px] overflow-y-auto">
                        {paginatedItems.length > 0 ? paginatedItems.map((user, idx) => (
                            <tr key={idx} className="hover:bg-red-500/5 transition-colors block sm:table-row w-full">
                                <td className="px-4 py-3 block sm:table-cell">
                                    <p className="text-[10px] font-black text-white uppercase">{user.first_name} {user.last_name}</p>
                                    <p className="text-[8px] text-gray-500 font-bold uppercase sm:hidden">{user.department}</p>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <p className="text-[9px] text-gray-400 font-black uppercase italic">{user.department}</p>
                                </td>
                                <td className="px-4 py-3 text-center block sm:table-cell">
                                    <span className="text-[11px] font-black text-red-500">{Math.round(user.progress)}%</span>
                                </td>
                                <td className="px-4 py-3 text-right block sm:table-cell">
                                    <button
                                        onClick={() => handleIndividualReminder(`${user.first_name} ${user.last_name}`)}
                                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all duration-300 group/btn shadow-lg shadow-red-500/0 hover:shadow-red-500/20"
                                        title="Enviar recordatorio individual"
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

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Seleccionar Unidad para Invitaciones</label>
                    <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-bold text-white focus:outline-none focus:border-red-500/50 transition-all appearance-none cursor-pointer"
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
                    className={`w-full py-5 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 ${selectedDept
                            ? 'bg-red-500 text-white hover:bg-red-400 shadow-red-500/20'
                            : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                >
                    <Mail className="w-4 h-4" /> Enviar Invitación a No Registrados
                </button>
                <p className="text-[9px] text-gray-500 text-center font-bold italic">
                    * Se enviará un correo a todos los funcionarios del área que aún no han ingresado a la plataforma.
                </p>
            </div>
        </div>
    );
}