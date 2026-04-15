import { Plus, X } from 'lucide-react';
import PremiumSelect from '../../PremiumSelect';

export default function LessonModal({ 
    isOpen, 
    onClose, 
    editingLesson, 
    formData, 
    setFormData, 
    onSave 
}) {
    if (!isOpen) return null;

    const lessonTypeOptions = [
        { value: 'reading', label: 'Lectura Estratégica' },
        { value: 'video', label: 'Laboratorio en Video' },
        { value: 'quiz', label: 'Evaluación de Campo' },
        { value: 'interactive', label: 'Ejercicio Interactivo' },
        { value: 'survey', label: 'Encuesta de Satisfacción' }
    ];

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-xl bg-[#0f121d] rounded-3xl border border-white/10 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 rounded-t-3xl"></div>
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-slate-950/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 border border-blue-500/20">
                                <Plus className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {editingLesson ? 'Editar Unidad' : 'Nueva Unidad'}
                                </h2>
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Gestión de Contenido Lectivo</p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <form onSubmit={onSave} className="p-8 space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Título de la Unidad</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            className="w-full bg-[#0a0d18] border border-white/5 focus:border-blue-500/50 rounded-xl py-3 px-4 text-white text-sm font-semibold outline-none transition-all placeholder-gray-700 hover:border-white/10"
                            placeholder="Ej: Análisis de Malware..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <PremiumSelect 
                            label="Metodología / Tipo"
                            options={lessonTypeOptions}
                            value={formData.lesson_type}
                            onChange={(val) => setFormData({ ...formData, lesson_type: val })}
                        />
                        
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tiempo Est. (Min)</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-blue-500/50 rounded-xl py-3.5 px-4 text-white text-sm outline-none transition-all hover:border-white/10"
                                value={formData.duration_minutes}
                                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Toggles Group */}
                    <div className="grid grid-cols-2 gap-4 pb-2">
                        {[
                            { id: 'is_published', label: 'Publicado', color: 'bg-emerald-500' },
                            { id: 'is_optional', label: 'Opcional', color: 'bg-indigo-500' }
                        ].map(toggle => (
                            <div key={toggle.id} className="flex items-center justify-between p-3 bg-slate-950/30 rounded-xl border border-white/5">
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{toggle.label}</span>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, [toggle.id]: !formData[toggle.id] })}
                                    className={`relative w-9 h-5 rounded-full transition-colors duration-200 outline-none ${formData[toggle.id] ? toggle.color : 'bg-slate-800'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 shadow-sm ${formData[toggle.id] ? 'left-5' : 'left-1'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 px-6 bg-transparent hover:bg-white/5 text-gray-500 hover:text-white font-bold uppercase tracking-widest rounded-xl transition-all text-[11px] active:scale-95"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-[1.5] py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-[11px]"
                        >
                            {editingLesson ? 'Guardar Cambios' : 'Crear Unidad'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
