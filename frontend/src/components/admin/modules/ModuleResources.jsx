import { Plus, FileText, Download, Edit2, Trash2, ExternalLink } from 'lucide-react';

export default function ModuleResources({ 
    resources, 
    onNewResource, 
    onEditResource, 
    onDeleteResource 
}) {
    return (
        <div className="mt-8 animate-slide-up bg-slate-950/20 p-6 md:p-8 rounded-3xl border border-white/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-secondary-500 rounded-full shadow-lg shadow-secondary-500/20"></div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] italic leading-none mb-1">Biblioteca de Recursos</h4>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{resources.length} ACTIVOS DIGITALES</p>
                    </div>
                </div>
                <button
                    onClick={onNewResource}
                    className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-secondary-500/10 hover:bg-secondary-500 text-secondary-400 hover:text-white py-2.5 px-6 rounded-xl transition-all border border-secondary-500/20 hover:shadow-xl hover:shadow-secondary-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Subir Recurso</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.length > 0 ? (
                    resources.map((res) => (
                        <div 
                            key={res.id} 
                            className="group/res flex flex-col p-5 bg-slate-900/60 border border-white/5 rounded-[2rem] hover:border-secondary-500/30 transition-all shadow-xl hover:bg-slate-900"
                        >
                            <div className="flex items-center gap-5 mb-5 overflow-hidden">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-2xl transition-all group-hover/res:scale-110 duration-500 flex-shrink-0
                                    ${res.resource_type === 'drive'
                                        ? 'bg-blue-600/10 border-blue-500/20 text-blue-400 shadow-blue-500/5'
                                        : 'bg-red-600/10 border-red-500/20 text-red-500 shadow-red-500/5'}`}>
                                    {res.resource_type === 'drive' ? (
                                        <svg viewBox="0 0 24 24" className="w-8 h-8 transition-transform group-hover/res:scale-110" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.71 3.502L1.15 14.782L4.44 20.492L11 9.212L7.71 3.502Z" fill="#FFC107" />
                                            <path d="M22.85 14.782L19.56 20.492H6.44L9.73 14.782H22.85Z" fill="#4CAF50" />
                                            <path d="M16.2 3.502H9.71L6.42 9.212L12.91 9.212L16.2 3.502Z" fill="#2196F3" />
                                        </svg>
                                    ) : (
                                        <FileText className="w-8 h-8" />
                                    )}
                                </div>
                                <div className="min-w-0 pr-4">
                                    <h5 className={`text-base font-black truncate transition-colors uppercase tracking-tight group-hover/res:text-white ${res.resource_type === 'drive' ? 'text-gray-300' : 'text-gray-300'}`}>
                                        {res.title}
                                    </h5>
                                    <p className="text-[10px] text-gray-600 uppercase font-bold tracking-widest line-clamp-1 italic">{res.description || 'Archivo educativo estratégico'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-white/5 shadow-inner">
                                    <button
                                        onClick={() => onEditResource(res)}
                                        className="p-2 text-gray-600 hover:text-white hover:bg-slate-800 rounded-lg transition-all group/btn"
                                        title="Propiedades"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteResource(res)}
                                        className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Eliminar Activo"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2.5 bg-secondary-500/10 text-secondary-500 hover:bg-secondary-500 hover:text-white rounded-xl transition-all shadow-xl shadow-secondary-500/5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group/link"
                                >
                                    ACCEDER
                                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center bg-slate-950/40 rounded-[3rem] border border-dashed border-white/10 group hover:bg-slate-950/60 transition-all duration-700">
                        <div className="p-5 bg-slate-900 rounded-[2rem] mb-5 group-hover:scale-110 group-hover:bg-secondary-500/5 transition-all duration-700 shadow-2xl border border-white/5 inline-block">
                            <Download className="w-10 h-10 text-gray-800 group-hover:text-secondary-500/40" />
                        </div>
                        <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] mb-1 italic">Repositorio Vacío</p>
                        <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest leading-relaxed">No se han detectado archivos estratégicos vinculados</p>
                    </div>
                )}
            </div>
        </div>
    );
}
