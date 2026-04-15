import { Users, Search, Mail, Award, ShieldCheck, Trophy, Medal, Crown, Target, Zap, ShieldAlert } from 'lucide-react';

const BadgeIcon = ({ name, title }) => {
    const icons = {
        'Award': Award,
        'ShieldCheck': ShieldCheck,
        'Trophy': Trophy,
        'Medal': Medal,
        'Crown': Crown,
        'Target': Target,
        'Zap': Zap,
        'ShieldAlert': ShieldAlert,
        'Users': Users
    };
    const Icon = icons[name] || Award;
    return (
        <div className="group/badge relative">
            <Icon className="w-4 h-4 text-primary-400 hover:text-secondary-400 transition-colors cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 border border-white/10 rounded-lg text-[8px] font-black text-white uppercase tracking-widest whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-all pointer-events-none z-20 shadow-2xl">
                {title}
            </div>
        </div>
    );
};

export default function DetailedUserList({ users, searchTerm, onSearchChange }) {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="flex items-center gap-4 text-left">
                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Listado Detallado</h2>
                        <p className="text-xs text-gray-400 font-medium font-bold uppercase tracking-widest">Seguimiento individual de funcionarios</p>
                    </div>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, unidad o email..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-slate-900 border border-white/5 rounded-2xl text-white font-medium focus:outline-none focus:border-primary-500/50 transition-all shadow-inner"
                    />
                </div>
            </div>

            <div className="card overflow-hidden !p-0">
                <div className="max-h-[800px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 sticky top-0 z-10 border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Funcionario</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Unidad / Área</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Insignias</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Progreso</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Módulos</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4 text-left">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-center text-gray-600 group-hover:bg-primary-500/10 group-hover:text-primary-400 transition-colors">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-white uppercase">{u.first_name} {u.last_name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium lowercase italic flex items-center gap-1">
                                                    <Mail className="w-3 h-3 opacity-30" /> {u.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-left">
                                        <p className="text-[11px] font-black text-gray-300 uppercase italic opacity-80">{u.department}</p>
                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">{u.position}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-center gap-2">
                                            {u.badges && u.badges.length > 0 ? (
                                                u.badges.map((b, i) => (
                                                    <BadgeIcon key={i} name={b.icon} title={b.name} />
                                                ))
                                            ) : (
                                                <span className="text-[9px] text-gray-700 font-bold uppercase italic opacity-40">Sin logros</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-left">
                                        <div className="w-full max-w-[150px] space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`text-[10px] font-black ${u.progress >= 80 ? 'text-green-500' : u.progress >= 50 ? 'text-orange-500' : 'text-red-500'}`}>{u.progress}%</span>
                                                <span className="text-[8px] font-bold text-gray-600 uppercase">Avance</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className={`h-full rounded-full ${u.progress >= 80 ? 'bg-green-500' : u.progress >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                                                    style={{ width: `${u.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="inline-flex flex-col items-end">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black text-white">{u.completed_modules}</span>
                                                <span className="text-xs font-bold text-gray-700">/ {u.total_modules}</span>
                                            </div>
                                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Completados</p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
