import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminSettingsHeader({ tabs, activeTab, onTabChange, onSave, saving }) {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 mb-8 animate-fade-in text-left">
            {/* Header simple similar al Dashboard principal */}
            <div className="flex flex-col items-start gap-3">
                <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-[9px] font-black uppercase tracking-widest"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Volver al Panel Admin
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                    <div className="space-y-0.5">
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase italic">
                            Configuración del Sistema
                        </h1>
                        <p className="text-white/40 font-medium text-xs">Módulo de gestión administrativa</p>
                    </div>

                    <button
                        onClick={onSave}
                        disabled={saving}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl border-2 ${
                            saving 
                            ? 'bg-slate-800 border-white/5 text-gray-500 cursor-not-allowed opacity-50' 
                            : 'bg-primary-600 border-primary-500/30 text-white hover:bg-primary-500 hover:scale-105 hover:shadow-primary-500/20'
                        }`}
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                    </button>
                </div>
            </div>

            {/* Pestañas de navegación abajo del header */}
            <div className="flex items-center gap-1.5 bg-slate-900/40 p-1 rounded-2xl border border-white/5 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab.id
                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 border border-white/10'
                            : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <tab.icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'animate-pulse' : 'opacity-40'}`} />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
