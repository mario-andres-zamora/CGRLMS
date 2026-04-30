import React from 'react';
import { Users, Mail, Building2, Briefcase, Clock, ArrowUp, ArrowDown, ArrowUpDown, Edit2, Trash2, Send } from 'lucide-react';

export default function DirectoryTable({ 
    items, 
    sortConfig, 
    onSort, 
    onEdit, 
    onDelete,
    onSendInvite
}) {
    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <ArrowUpDown className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />;
        }
        return sortConfig.direction === 'asc' ? 
            <ArrowUp className="w-3 h-3 text-primary-400" /> : 
            <ArrowDown className="w-3 h-3 text-primary-400" />;
    };

    return (
        <div className="card overflow-hidden !p-0 border-white/5 bg-slate-900/40 backdrop-blur-sm text-left">
            <div className="max-h-[800px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 border-b border-white/5 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-[9px] font-black text-white/50 uppercase tracking-widest pl-10 cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => onSort('full_name')}>
                                <div className="flex items-center gap-2">
                                    Funcionario
                                    {renderSortIcon('full_name')}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-[9px] font-black text-white/50 uppercase tracking-widest cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => onSort('department')}>
                                <div className="flex items-center gap-2">
                                    Unidad Administrativa
                                    {renderSortIcon('department')}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-[9px] font-black text-white/50 uppercase tracking-widest cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => onSort('position')}>
                                <div className="flex items-center gap-2">
                                    Cargo
                                    {renderSortIcon('position')}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-[9px] font-black text-white/50 uppercase tracking-widest text-center cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => onSort('is_registered')}>
                                <div className="flex items-center justify-center gap-2">
                                    Estado
                                    {renderSortIcon('is_registered')}
                                </div>
                            </th>
                            <th className="px-6 py-4 text-[9px] font-black text-white/50 uppercase tracking-widest text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {items.map((person) => (
                            <tr key={person.id} className={`hover:bg-white/[0.02] transition-colors group ${!person.is_registered ? 'opacity-80' : ''}`}>
                                <td className="px-6 py-4 pl-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border group-hover:scale-110 transition-transform duration-300 ${person.is_registered ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-slate-800 text-gray-600 border-white/5'}`}>
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-extrabold text-white group-hover:text-primary-300 transition-colors uppercase tracking-tight">{person.full_name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold flex items-center gap-1.5 mt-0.5">
                                                <Mail className="w-3 h-3 text-primary-500" /> {person.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-[11px] font-extrabold text-white uppercase tracking-tighter flex items-center gap-2 text-left">
                                        <Building2 className="w-3.5 h-3.5 text-secondary-500" />
                                        {person.department || 'Sin Unidad'}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight flex items-center gap-2 text-left">
                                        <Briefcase className="w-3.5 h-3.5 text-primary-500/50" />
                                        {person.position || 'N/A'}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {person.is_registered ? (
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-[8px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 shadow-sm">Activo</span>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase mt-1.5 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {person.last_login ? new Date(person.last_login).toLocaleDateString() : 'S/I'}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">Pendiente</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 transition-opacity">
                                        {!person.is_registered && onSendInvite && (
                                            <button
                                                onClick={() => onSendInvite(person)}
                                                className="p-2 bg-secondary-500/10 text-secondary-500 hover:bg-secondary-500 hover:text-white rounded-lg transition-all shadow-lg hover:shadow-secondary-500/10"
                                                title="Enviar invitación por correo"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onEdit(person)}
                                            className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/10"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(person)}
                                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all shadow-lg hover:shadow-red-500/10"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
