import React, { useState } from 'react';
import { Gift } from 'lucide-react';

export default function BadgeAwardModal({ isOpen, onClose, badge, onAward }) {
    const [email, setEmail] = useState('');

    if (!isOpen || !badge) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        const success = await onAward(badge.id, email);
        if (success) {
            setEmail('');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
            <div className="card w-full max-w-md !p-0 overflow-hidden border-white/10 shadow-[0_0_100px_rgba(56,74,153,0.2)]">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <Gift className="w-6 h-6 text-primary-400" />
                        Otorgar Insignia
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 text-left">
                        Otorgando <strong>{badge.name}</strong> a un usuario específico.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block text-left">Correo del Usuario</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:border-primary-500 transition-all font-bold placeholder:text-gray-800"
                                placeholder="usuario@ejemplo.com"
                                required
                            />
                        </div>
                    </div>

                    <footer className="p-8 bg-white/[0.02] border-t border-white/5 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!email}
                            className="flex-1 py-4 bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-400 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                        >
                            Otorgar
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
