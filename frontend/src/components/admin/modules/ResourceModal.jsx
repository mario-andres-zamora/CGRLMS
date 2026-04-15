import { Download, X } from 'lucide-react';

export default function ResourceModal({ 
    isOpen, 
    onClose, 
    editingResource, 
    formData, 
    setFormData, 
    onSave 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
            <div className="relative w-full max-w-xl bg-slate-900 rounded-[3rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="p-10 border-b border-white/5 bg-slate-950/40">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-secondary-500/20 rounded-[1.5rem] text-secondary-400 border border-secondary-500/20 shadow-xl shadow-secondary-500/10 active:scale-95 transition-transform">
                            <Download className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight leading-none mb-1">
                                {editingResource ? 'Actualizar Recurso' : 'Habilitar Nuevo Activo'}
                            </h2>
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.4em] italic leading-none">Biblioteca Estratégica v1.0</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="ml-auto p-3 hover:bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all active:scale-90"
                        >
                            <X className="w-7 h-7" />
                        </button>
                    </div>
                </div>

                <form onSubmit={onSave} className="p-10 space-y-8 bg-slate-900/50">
                    <div className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Título del Recurso Digital</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-950/80 border border-white/10 focus:border-secondary-500/50 rounded-2xl py-5 px-6 text-white text-lg font-black placeholder-gray-800 outline-none transition-all shadow-inner hover:border-white/20"
                                placeholder="Ej: Manual Táctico de Ciberdefensa PDF..."
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Tipo de Activo Estratégico</label>
                            <div className="relative group/select">
                                <select
                                    className="w-full bg-slate-950/80 border border-white/10 focus:border-secondary-500/50 rounded-2xl py-4 px-6 text-white font-black outline-none transition-all appearance-none cursor-pointer shadow-inner hover:border-white/20 italic"
                                    value={formData.resource_type}
                                    onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                                >
                                    <option value="pdf">Documento PDF Maestro</option>
                                    <option value="drive">Repositorio en la Nube (Drive/Web)</option>
                                    <option value="video">Material Audiovisual Externo</option>
                                    <option value="other">Otros Activos Digitales</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600 group-hover/select:text-secondary-500 transition-colors">
                                    <X className="w-5 h-5 rotate-45" />
                                </div>
                            </div>
                        </div>

                        {formData.resource_type === 'drive' ? (
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Dirección URL Segura</label>
                                <input
                                    type="url"
                                    className="w-full bg-slate-950/80 border border-white/10 focus:border-secondary-500/50 rounded-2xl py-4 px-6 text-white font-black placeholder-gray-800 outline-none transition-all shadow-inner hover:border-white/20"
                                    placeholder="https://drive.google.com/..."
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Carga de Archivo Estratégico</label>
                                    <div className="relative group/file">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setFormData({ ...formData, file, url: file.name });
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className={`flex flex-col items-center justify-center w-full min-h-[120px] bg-slate-950/80 border-2 border-dashed rounded-3xl cursor-pointer transition-all p-6 group-hover/file:bg-slate-950
                                                ${formData.file ? 'border-secondary-500/50 bg-secondary-500/5' : 'border-white/5 hover:border-secondary-500/30'}`}
                                        >
                                            <Download className={`w-8 h-8 mb-3 transition-transform group-hover/file:-translate-y-1 ${formData.file ? 'text-secondary-400' : 'text-gray-700'}`} />
                                            {formData.file ? (
                                                <div className="text-center">
                                                    <p className="text-secondary-400 font-black text-xs uppercase tracking-tight">{formData.file.name}</p>
                                                    <p className="text-gray-600 text-[9px] mt-1 uppercase">Haga clic para reemplazar el activo</p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <p className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">Seleccionar archivo local</p>
                                                    <p className="text-gray-700 text-[8px] mt-2 uppercase tracking-tighter italic">PDF, Word, Excel, ZIP hasta 20MB</p>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="relative flex items-center py-2">
                                    <div className="flex-grow border-t border-white/5"></div>
                                    <span className="flex-shrink mx-4 text-[9px] font-black text-gray-700 uppercase tracking-widest italic">O vincular ruta manual</span>
                                    <div className="flex-grow border-t border-white/5"></div>
                                </div>

                                <div className="space-y-2.5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 italic">Referencia Manual (URL o Nombre)</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950/80 border border-white/10 focus:border-secondary-500/50 rounded-2xl py-4 px-6 text-white font-black placeholder-gray-800 outline-none transition-all shadow-inner hover:border-white/20"
                                        placeholder="Nombre del archivo o ruta interna..."
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6 pt-10 border-t border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-5 px-8 bg-slate-950 hover:bg-slate-800 text-gray-500 hover:text-white font-black uppercase tracking-[0.3em] rounded-2xl border border-white/5 transition-all text-[11px] shadow-xl active:scale-95"
                        >
                            DESCARTAR
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] py-5 px-8 bg-secondary-600 hover:bg-secondary-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-2xl shadow-secondary-600/30 active:scale-95 text-[11px] border border-secondary-500/20"
                        >
                            {editingResource ? 'GUARDAR ACTUALIZACIÓN' : 'INSTANCIAR ACTIVO'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
