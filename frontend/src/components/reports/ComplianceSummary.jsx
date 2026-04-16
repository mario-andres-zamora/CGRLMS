import React from 'react';
import { Users, Zap, Radio } from 'lucide-react';

export default function ComplianceSummary({ summary }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Registrados vs Directorio */}
            <div className="card p-8 border-l-4 border-primary-500 bg-slate-900/40 text-left">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-primary-500/10 rounded-2xl text-primary-400">
                        <Users className="w-7 h-7" />
                    </div>
                    <div className="px-2 py-1 bg-green-500/10 rounded-lg">
                        <span className="text-[9px] font-black text-green-500 uppercase">Usuarios Registrados</span>
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white">{summary.registeredStaff}</p>
                    <p className="text-lg font-black text-gray-400 opacity-60">/ {summary.totalStaff}</p>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-1">Registrados vs Directorio</p>
            </div>

            {/* 2. En Línea (Tiempo Real) */}
            <div className="card p-8 border-l-4 border-green-500 bg-slate-900/40 text-left overflow-hidden relative">
                <div className="flex justify-between items-start mb-6 underline-none">
                    <div className="p-3 bg-green-500/10 rounded-2xl text-green-400">
                        <Radio className="w-7 h-7 animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">En Tiempo Real</span>
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white">{summary.onlineUsers || 0}</p>
                </div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-2 px-1">Usuarios Activos Ahora</p>

                {/* Subtle background glow */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500/5 blur-3xl rounded-full"></div>
            </div>

            {/* 3. Gamificación (Puntos) */}
            <div className="card p-8 border-l-4 border-purple-500 bg-slate-900/40 text-left">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                        <Zap className="w-7 h-7" />
                    </div>
                    <div className="px-2 py-1 bg-purple-500/10 rounded-lg">
                        <span className="text-[9px] font-black text-purple-500 uppercase">Resumen de Puntos</span>
                    </div>
                </div>
                <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-black text-white">{summary.totalPoints?.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Puntos Totales Acumulados</p>
                    <p className="text-[10px] font-black text-purple-400">Promedio: {summary.avgPointsPerUser}</p>
                </div>
            </div>
        </div>
    );
}
