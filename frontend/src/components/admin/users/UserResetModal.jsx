import React, { useState } from 'react';
import { X, RotateCcw, AlertTriangle, Layers, User } from 'lucide-react';
import PremiumSelect from '../../PremiumSelect';

export default function UserResetModal({ isOpen, onClose, user, modules, onConfirm }) {
    const [resetType, setResetType] = useState('all'); // 'all' or 'module'
    const [selectedModuleId, setSelectedModuleId] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);

    if (!isOpen) return null;

    const moduleOptions = modules.map(mod => ({
        value: mod.id,
        label: mod.title
    }));

    const handleConfirm = () => {
        setIsConfirming(true);
        onConfirm(resetType === 'all' ? null : selectedModuleId);
        setIsConfirming(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-orange-500/10 to-transparent text-left">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/20">
                                <RotateCcw className="w-6 h-6 text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight">Reiniciar Progreso</h3>
                                <p className="text-gray-400 text-sm font-medium">Gestionando a: <span className="text-orange-400">{user?.first_name} {user?.last_name}</span></p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6 text-left">
                    {/* Warning Box */}
                    <div className="flex gap-4 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                        <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
                        <p className="text-sm text-orange-200/70 leading-relaxed font-medium">
                            Esta acción purgará el historial seleccionado. Los puntos se recalcularán automáticamente basándose en el progreso restante.
                        </p>
                    </div>

                    {/* Reset Type Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setResetType('all')}
                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${
                                resetType === 'all' 
                                    ? 'bg-orange-500/20 border-orange-500/40' 
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                        >
                            <User className={`w-6 h-6 ${resetType === 'all' ? 'text-orange-400' : 'text-gray-500'}`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${resetType === 'all' ? 'text-white' : 'text-gray-500'}`}>Reiniciar Todo</span>
                        </button>
                        <button
                            onClick={() => setResetType('module')}
                            className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 group ${
                                resetType === 'module' 
                                    ? 'bg-orange-500/20 border-orange-500/40' 
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                            }`}
                        >
                            <Layers className={`w-6 h-6 ${resetType === 'module' ? 'text-orange-400' : 'text-gray-500'}`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${resetType === 'module' ? 'text-white' : 'text-gray-500'}`}>Por Módulo</span>
                        </button>
                    </div>

                    {/* Module Selector (Conditional) */}
                    {resetType === 'module' && (
                        <div className="animate-fade-in">
                            <PremiumSelect
                                label="Seleccionar Módulo"
                                options={moduleOptions}
                                value={selectedModuleId}
                                onChange={setSelectedModuleId}
                                placeholder="Elegir un módulo..."
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 pt-0 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-4 rounded-2xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        disabled={resetType === 'module' && !selectedModuleId || isConfirming}
                        onClick={handleConfirm}
                        className={`flex-[2] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
                            resetType === 'module' && !selectedModuleId 
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                    >
                        <RotateCcw className="w-4 h-4" />
                        Ejecutar Reinicio
                    </button>
                </div>
            </div>
        </div>
    );
}
