import React from 'react';
import { Plus, BookOpen, CheckCircle2, EyeOff, Search, Filter } from 'lucide-react';

export default function AdminModulesHeader({ totalModules, publishedModules, draftModules, onNewModule, searchTerm, onSearchChange }) {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Title and Top Action Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-white tracking-tight">Gestión de Módulos</h1>
                    <p className="text-gray-400 text-sm font-medium">Administra el contenido educativo de CGR Segur@</p>
                </div>
                <button
                    onClick={onNewModule}
                    className="flex items-center gap-2 px-6 py-3 bg-[#2b4193] hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">Nuevo Módulo</span>
                </button>
            </div>

            {/* Stats Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Modules Card */}
                <div className="bg-[#121625] border border-white/5 rounded-2xl p-6 flex items-center gap-5 hover:border-white/10 transition-all shadow-xl group">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-500 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-2">Total Módulos</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tight">{totalModules}</p>
                    </div>
                </div>

                {/* Published Modules Card */}
                <div className="bg-[#0f1d1d] border border-emerald-500/5 rounded-2xl p-6 flex items-center gap-5 hover:border-emerald-500/10 transition-all shadow-xl group">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-2">Publicados</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tight">{publishedModules}</p>
                    </div>
                </div>

                {/* Draft Modules Card */}
                <div className="bg-[#1c1216] border border-orange-500/5 rounded-2xl p-6 flex items-center gap-5 hover:border-orange-500/10 transition-all shadow-xl group">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20 text-orange-500 group-hover:scale-110 transition-transform">
                        <EyeOff className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none mb-2">Borradores</p>
                        <p className="text-3xl font-black text-white leading-none tracking-tight">{draftModules}</p>
                    </div>
                </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Buscar por título o descripción..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-[#0a0d18] border border-white/5 rounded-xl pl-12 pr-6 py-4 text-sm text-gray-200 font-medium focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 bg-[#121625] border border-white/5 rounded-xl text-gray-400 hover:text-white hover:border-white/10 transition-all group shadow-lg">
                    <Filter className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Filtros</span>
                </button>
            </div>
        </div>
    );
}
