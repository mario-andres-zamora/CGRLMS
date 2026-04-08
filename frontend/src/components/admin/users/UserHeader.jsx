import React from 'react';
import { ArrowLeft, Search } from 'lucide-react';

export default function UserHeader({
    searchTerm,
    onSearchChange,
    onBack
}) {
    return (
        <div className="flex flex-col items-start gap-8 text-left mb-6">
            <div className="space-y-4 w-full">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> VOLVER AL PANEL ADMIN
                </button>

                <div>
                    <h1 className="text-3xl md:text-[40px] font-black text-white uppercase tracking-tight leading-none mb-2 whitespace-nowrap">
                        GESTIÓN DE USUARIOS
                    </h1>
                    <p className="text-sm font-medium text-gray-400">
                        Control de acceso y roles de funcionarios de la CGR.
                    </p>
                </div>
            </div>

            <div className="w-full md:w-[400px]">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                    <input
                        id="user-search-input"
                        name="user-search"
                        type="text"
                        autoComplete="off"
                        placeholder="Buscar por nombre, email o unidad..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-white/5 hover:border-white/10 rounded-2xl text-white text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-gray-500 shadow-inner"
                    />
                </div>
            </div>
        </div>
    );
}
