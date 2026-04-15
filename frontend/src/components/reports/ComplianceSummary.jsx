import React from 'react';
import { Users, TrendingUp, Award, FileText } from 'lucide-react';

export default function ComplianceSummary({ summary }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card p-8 border-l-4 border-primary-500 bg-slate-900/40 text-left">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-primary-500/10 rounded-2xl text-primary-400">
                        <Users className="w-7 h-7" />
                    </div>
                    <div className="px-2 py-1 bg-green-500/10 rounded-lg">
                        <span className="text-[9px] font-black text-green-500 uppercase">Activos</span>
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white">{summary.registeredStaff}</p>
                    <p className="text-lg font-black text-gray-500 opacity-60">/ {summary.totalStaff}</p>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-1">Registrados vs Directorio</p>
            </div>

            <div className="card p-8 border-l-4 border-secondary-500 bg-slate-900/40 text-left">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-secondary-500/10 rounded-2xl text-secondary-500">
                        <TrendingUp className="w-7 h-7" />
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-black text-white bg-slate-800 px-3 py-1 rounded-full border border-white/5">
                        PROMEDIO
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white">{summary.avgCompletion}</p>
                    <p className="text-xl font-black text-secondary-500">%</p>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-1">Cumplimiento Global</p>
            </div>

            <div className="card p-8 border-l-4 border-green-500 bg-slate-900/40 text-left">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                        <Award className="w-7 h-7" />
                    </div>
                </div>
                <p className="text-4xl font-black text-white">{summary.totalCerts}</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-1">Diplomas Emitidos</p>
            </div>

            <div className="card p-8 border-l-4 border-blue-500 bg-slate-900/40 text-left">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                        <FileText className="w-7 h-7" />
                    </div>
                </div>
                <p className="text-4xl font-black text-white">{summary.activeModules}</p>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-1">Módulos Publicados</p>
            </div>
        </div>
    );
}
