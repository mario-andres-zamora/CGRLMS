import { Shield, Clock, RotateCw, AlertTriangle } from 'lucide-react';

export default function MfaDefenderEditor({ formData, setFormData }) {
    // Default values if not set
    const hackTime = formData.data?.hack_time || 20;
    const rotateTime = formData.data?.rotate_time || 5;
    const description = formData.data?.description || 'El atacante ha conseguido tu contraseña. Ingresa el código del Authenticator antes de que vulnere tu cuenta.';

    const handleChange = (field, value) => {
        let currentData = formData.data;
        if (typeof currentData === 'string') {
            try {
                currentData = currentData ? JSON.parse(currentData) : {};
            } catch (e) {
                currentData = { description: currentData };
            }
        }
        
        setFormData({
            ...formData,
            data: {
                ...currentData,
                [field]: value
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Configuración del Simulador MFA</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Contexto o Escenario</label>
                        <textarea
                            className="w-full bg-[#0a0d18] border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-white text-sm font-semibold outline-none transition-all hover:border-white/10 resize-none h-24 custom-scrollbar"
                            placeholder="Ej: Faltan segundos para que hackeen el servidor..."
                            value={description}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                <Clock className="w-3 h-3 text-red-400" /> Tiempo de Hackeo (seg)
                            </label>
                            <input
                                type="number"
                                min="5"
                                max="120"
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-red-500/50 rounded-xl py-3 px-4 text-white text-sm font-black outline-none transition-all hover:border-white/10"
                                value={hackTime}
                                onChange={e => handleChange('hack_time', parseInt(e.target.value) || 20)}
                            />
                            <p className="text-[9px] text-gray-500 italic ml-1 leading-tight">Tiempo total de reacción.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                <RotateCw className="w-3 h-3 text-emerald-400" /> Cambio de Código (seg)
                            </label>
                            <input
                                type="number"
                                min="2"
                                max="30"
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-emerald-500/50 rounded-xl py-3 px-4 text-white text-sm font-black outline-none transition-all hover:border-white/10"
                                value={rotateTime}
                                onChange={e => handleChange('rotate_time', parseInt(e.target.value) || 5)}
                            />
                            <p className="text-[9px] text-gray-500 italic ml-1 leading-tight">Frecuencia del Authenticator.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                <AlertTriangle className="w-3 h-3 text-yellow-500" /> Penalización x Fallo
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-yellow-500/50 rounded-xl py-3 px-4 text-white text-sm font-black outline-none transition-all hover:border-white/10"
                                value={formData.data?.fail_penalty ?? 0}
                                onChange={e => handleChange('fail_penalty', parseInt(e.target.value) || 0)}
                            />
                            <p className="text-[9px] text-gray-500 italic ml-1 leading-tight">Puntos a restar por error.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
