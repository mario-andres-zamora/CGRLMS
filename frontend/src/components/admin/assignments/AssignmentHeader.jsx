import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function AssignmentHeader({ onBack, pendingCount, totalCount }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900 px-8 py-6 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-md text-left">
            <div className="flex flex-col items-start gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al Panel Admin
                </button>
                <div className="flex items-center gap-6">
                    <div className="space-y-1 text-left">
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight italic">Centro de <span className="text-secondary-500">Evaluación</span></h1>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/50 p-2 rounded-2xl border border-white/5">
                <div className="flex flex-col items-end px-4">
                    <span className="text-xl font-black text-white">{pendingCount}</span>
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Tareas Pendientes</span>
                </div>
                <div className="w-[1px] h-10 bg-white/5"></div>
                <div className="flex flex-col items-end px-4">
                    <span className="text-xl font-black text-gray-400">{totalCount}</span>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Total Histórico</span>
                </div>
            </div>
        </div>
    );
}
