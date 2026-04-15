import { LayoutGrid, X } from 'lucide-react';
import PremiumSelect from '../../PremiumSelect';

export default function ModuleModal({ 
    isOpen, 
    onClose, 
    editingModule, 
    formData, 
    setFormData, 
    onSave 
}) {
    if (!isOpen) return null;

    const monthOptions = [
        { value: 'Enero', label: 'Enero' },
        { value: 'Febrero', label: 'Febrero' },
        { value: 'Marzo', label: 'Marzo' },
        { value: 'Abril', label: 'Abril' },
        { value: 'Mayo', label: 'Mayo' },
        { value: 'Junio', label: 'Junio' },
        { value: 'Julio', label: 'Julio' },
        { value: 'Agosto', label: 'Agosto' },
        { value: 'Septiembre', label: 'Septiembre' },
        { value: 'Octubre', label: 'Octubre' },
        { value: 'Noviembre', label: 'Noviembre' },
        { value: 'Diciembre', label: 'Diciembre' }
    ];

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-2xl bg-[#0f121d] rounded-3xl border border-white/10 shadow-2xl">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 rounded-t-3xl"></div>
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-slate-950/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {editingModule ? 'Editar Módulo' : 'Nuevo Módulo'}
                                </h2>
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Gestión de Contenido Educativo</p>
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
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Número de Módulo</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-white text-sm font-semibold outline-none transition-all hover:border-white/10"
                                value={formData.module_number}
                                onChange={(e) => setFormData({ ...formData, module_number: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Orden / Posición</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-white text-sm font-semibold outline-none transition-all hover:border-white/10"
                                value={formData.order_index}
                                onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Título del Módulo</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-[#0a0d18] border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-white text-sm font-semibold outline-none transition-all hover:border-white/10"
                            placeholder="Ej: Fundamentos de Ciberseguridad"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Descripción Corta</label>
                        <textarea
                            rows="2"
                            className="w-full bg-[#0a0d18] border border-white/5 focus:border-indigo-500/50 rounded-2xl py-3 px-4 text-white text-sm outline-none transition-all hover:border-white/10 resize-none"
                            placeholder="Breve descripción de los temas a tratar..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Fecha de Lanzamiento</label>
                            <input
                                type="date"
                                className="w-full bg-[#0a0d18] border border-white/5 focus:border-indigo-500/50 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all hover:border-white/10 [color-scheme:dark]"
                                value={formData.release_date}
                                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                            />
                        </div>
                        <PremiumSelect 
                            label="Mes de Referencia"
                            options={monthOptions}
                            value={formData.month}
                            onChange={(val) => setFormData({ ...formData, month: val })}
                        />
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">URL de Imagen (Banner)</label>
                        <input
                            type="text"
                            placeholder="https://..."
                            className="w-full bg-[#0a0d18] border border-white/5 focus:border-indigo-500/50 rounded-xl py-3.5 px-4 text-white text-xs outline-none transition-all hover:border-white/10 font-mono"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        />
                    </div>

                    {/* Toggles Group */}
                    <div className="grid grid-cols-3 gap-4 pb-2">
                        {[
                            { id: 'is_published', label: 'Publicado', color: 'bg-emerald-500' },
                            { id: 'generates_certificate', label: 'Certificado', color: 'bg-blue-500' },
                            { id: 'requires_previous', label: 'Secuencial', color: 'bg-slate-400' }
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
                            className="flex-[1.5] py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 text-[11px]"
                        >
                            {editingModule ? 'Guardar Cambios' : 'Crear Módulo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
