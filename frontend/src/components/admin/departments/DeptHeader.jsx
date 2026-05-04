import React from 'react';
import { ArrowLeft, RefreshCw, Trash2, Plus } from 'lucide-react';

export default function DeptHeader({ onBack, onSync, onDeleteAll, onAdd, isSyncing, hasDepts }) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
            <div className="space-y-1">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest mb-1"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Volver al Panel Admin
                </button>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">Gestión de Áreas / Unidades</h1>
                <p className="text-gray-400 text-xs font-medium">Define las unidades administrativas</p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={onSync}
                    disabled={isSyncing}
                    className={`px-4 py-2.5 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg flex items-center gap-2 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} /> Sincronizar
                </button>

                <button
                    onClick={onDeleteAll}
                    disabled={!hasDepts}
                    className="px-4 py-2.5 bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-lg flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <Trash2 className="w-4 h-4" /> Eliminar Todo
                </button>

                <button
                    onClick={onAdd}
                    className="px-4 py-2.5 bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-400 transition-all shadow-lg flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Nueva Área
                </button>
            </div>
        </div>
    );
}
