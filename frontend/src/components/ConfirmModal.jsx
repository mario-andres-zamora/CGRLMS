import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmar Acción',
    message = '¿Estás seguro de que deseas realizar esta acción?',
    confirmText = 'Continuar',
    cancelText = 'Cancelar',
    isDestructive = false
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[4000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-md bg-[#0f121d] rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isDestructive ? 'from-red-600 via-red-400 to-red-600' : 'from-yellow-600 via-yellow-400 to-yellow-600'}`}></div>
                
                <div className="p-8">
                    <div className="flex items-start gap-5">
                        <div className={`p-4 rounded-2xl shrink-0 ${isDestructive ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                            <p className="text-gray-400 text-sm font-medium mt-2 leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-10">
                        <button
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-gray-500 hover:text-white hover:bg-white/5 transition-all outline-none"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-8 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 outline-none ${
                                isDestructive
                                ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
                                : 'bg-primary-600 hover:bg-primary-500 shadow-primary-500/20'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
