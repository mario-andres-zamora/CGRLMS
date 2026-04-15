import React from 'react';
import { Building2, Search, ChevronUp, ChevronDown } from 'lucide-react';

export default function PerformanceTable({ departments, searchTerm, onSearchChange, onSort, sortConfig }) {
    const filteredDepartments = departments.filter(d => 
        d.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="card overflow-hidden !p-0">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02] text-left">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-primary-400" /> Tabla de Rendimiento
                </h3>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Buscar unidad..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-900/50 border border-white/10 rounded-xl text-[10px] text-white focus:outline-none focus:border-primary-500/50 uppercase font-black"
                    />
                </div>
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-white/5">
                    <tr>
                        <th className="px-8 py-5 cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => onSort('department')}>
                            <div className="flex items-center gap-2">
                                Área / Unidad
                                {sortConfig.key === 'department' && (
                                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-primary-400" /> : <ChevronDown className="w-3 h-3 text-primary-400" />
                                )}
                            </div>
                        </th>
                        <th className="px-8 py-5 text-center cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => onSort('total_pax')}>
                            <div className="flex items-center justify-center gap-2">
                                Total Pax
                                {sortConfig.key === 'total_pax' && (
                                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-primary-400" /> : <ChevronDown className="w-3 h-3 text-primary-400" />
                                )}
                            </div>
                        </th>
                        <th className="px-8 py-5 text-center cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => onSort('registered_count')}>
                            <div className="flex items-center justify-center gap-2">
                                Registrados
                                {sortConfig.key === 'registered_count' && (
                                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-primary-400" /> : <ChevronDown className="w-3 h-3 text-primary-400" />
                                )}
                            </div>
                        </th>
                        <th className="px-8 py-5 text-center cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => onSort('avg_completion')}>
                            <div className="flex items-center justify-center gap-2">
                                % Cumplimiento
                                {sortConfig.key === 'avg_completion' && (
                                    sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-primary-400" /> : <ChevronDown className="w-3 h-3 text-primary-400" />
                                )}
                            </div>
                        </th>
                        <th className="px-8 py-5 text-right">Estatus</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {filteredDepartments.map((dept, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-8 py-6">
                                <p className="text-sm font-black text-white group-hover:text-primary-400 transition-colors uppercase text-left">{dept.department}</p>
                            </td>
                            <td className="px-8 py-6 text-center">
                                <span className="text-xs font-black text-gray-300">{dept.total_pax}</span>
                            </td>
                            <td className="px-8 py-6 text-center">
                                <span className="text-xs font-black text-white">{dept.registered_count || 0}</span>
                                <span className="text-[10px] text-gray-500 ml-1">/ {dept.total_pax}</span>
                            </td>
                            <td className="px-8 py-6 max-w-[200px]">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                        <div
                                            className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)] transition-all duration-1000 ${dept.avg_completion >= 80 ? 'bg-green-500' :
                                                dept.avg_completion >= 50 ? 'bg-orange-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${dept.avg_completion}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-black text-white w-10">{dept.avg_completion}%</span>
                                </div>
                            </td>
                            <td className="px-8 py-6 text-right text-left">
                                <div className={`inline-flex px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${dept.avg_completion >= 80 ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                    dept.avg_completion >= 50 ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}>
                                    {dept.avg_completion >= 80 ? 'Excelente' : dept.avg_completion >= 50 ? 'En Progreso' : 'Crítico'}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
