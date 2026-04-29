import { Activity, Shield, Target } from 'lucide-react';

export default function DataTetrisEditor({ formData, setFormData }) {
    // Default values if not set
    const difficulty = formData.data?.difficulty || 'easy';
    const minScore = formData.data?.min_score || 500;
    const description = formData.data?.description || 'Juega una partida de Data Tetris y clasifica correctamente los datos personales para evitar filtraciones.';

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
            <div className="bg-primary-500/10 border border-primary-500/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Activity className="w-5 h-5 text-primary-400" />
                    <h3 className="text-sm font-black text-primary-400 uppercase tracking-widest">Configuración de Data Tetris</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Descripción del Objetivo</label>
                        <textarea
                            className="w-full bg-[#0a0d18] border border-white/5 focus:border-primary-500/50 rounded-xl py-3 px-4 text-white text-sm font-semibold outline-none transition-all hover:border-white/10 resize-none h-24 custom-scrollbar"
                            placeholder="Ej: Clasifica los datos para salvar el sistema..."
                            value={description}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                <Shield className="w-3 h-3 text-indigo-400" /> Dificultad Inicial
                            </label>
                            <select
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-white text-sm font-black outline-none transition-all hover:border-white/10"
                                value={difficulty}
                                onChange={e => handleChange('difficulty', e.target.value)}
                            >
                                <option value="easy">Básico (Lento)</option>
                                <option value="medium">Medio (Normal)</option>
                                <option value="hard">Avanzado (Rápido)</option>
                            </select>
                            <p className="text-[9px] text-gray-500 italic ml-1 leading-tight">Velocidad de caída inicial.</p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                <Target className="w-3 h-3 text-emerald-400" /> Puntaje Mínimo Requerido
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="100"
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-emerald-500/50 rounded-xl py-3 px-4 text-white text-sm font-black outline-none transition-all hover:border-white/10"
                                value={minScore}
                                onChange={e => handleChange('min_score', parseInt(e.target.value) || 0)}
                            />
                            <p className="text-[9px] text-gray-500 italic ml-1 leading-tight">Puntaje para considerar la lección como visitada.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
