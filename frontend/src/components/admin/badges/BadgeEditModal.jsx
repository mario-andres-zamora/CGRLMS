import React from 'react';
import { Edit2, Plus, Info } from 'lucide-react';

// Obtenemos todas las imágenes de la carpeta dinámicamente usando Vite
const imagesContext = import.meta.glob('/public/images/badges/*.{svg,png,jpg,jpeg,gif}');
const badgeImages = Object.keys(imagesContext).map(path => path.split('/').pop());

export default function BadgeEditModal({ isOpen, onClose, editingBadge, formData, setFormData, onSave }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-left">
            <div className="card w-full max-w-2xl !p-0 overflow-hidden border-white/10 shadow-[0_0_100px_rgba(56,74,153,0.2)]">
                <div className="p-10 border-b border-white/5 bg-white/[0.02]">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        {editingBadge ? <Edit2 className="w-6 h-6 text-primary-400" /> : <Plus className="w-6 h-6 text-primary-400" />}
                        {editingBadge ? 'Editar Insignia' : 'Nueva Insignia'}
                    </h2>
                    <p className="text-gray-400 text-sm mt-2 text-left">Define la identidad visual de este reconocimiento.</p>
                </div>

                <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {/* Visual Preview */}
                    <div className="flex justify-center py-6 bg-slate-900/50 rounded-3xl border border-white/5">
                        <img
                            src={`/images/badges/${formData.image_url || 'inicio-seguridad.svg'}`}
                            alt="Vista previa"
                            className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mb-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block text-left">Nombre</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:border-primary-500 transition-all font-bold placeholder:text-gray-800"
                                placeholder="Ej: Defensor de Datos"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block text-left">Imagen de Insignia</label>
                            <select
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
                            >
                                {badgeImages.map(img => (
                                    <option key={img} value={img}>{img.split('.')[0].replace(/-/g, ' ')}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block text-left">Puntos</label>
                            <input
                                type="number"
                                value={formData.points ?? 10}
                                onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
                                className="w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:border-primary-500 transition-all font-bold placeholder:text-gray-800"
                                placeholder="Ej: 10"
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="space-y-3 text-left">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 block text-left">Descripción</label>
                        <textarea
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-900 border border-white/10 rounded-2xl text-white font-medium focus:outline-none focus:border-primary-500 transition-all resize-none font-bold placeholder:text-gray-800"
                            placeholder="Explica qué representa esta insignia..."
                        />
                    </div>
                </div>

                <footer className="p-10 bg-white/[0.02] border-t border-white/5 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 py-5 bg-primary-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary-500/20 hover:bg-primary-400 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        {editingBadge ? 'Guardar Cambios' : 'Crear Insignia'}
                    </button>
                </footer>
            </div>
        </div>
    );
}