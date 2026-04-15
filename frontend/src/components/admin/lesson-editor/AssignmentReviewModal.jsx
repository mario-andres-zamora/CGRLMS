import { Upload, AlertTriangle, FileText, X } from 'lucide-react';

export default function AssignmentReviewModal({ 
    isOpen, 
    onClose, 
    assignment, 
    submissions, 
    onGrade, 
    apiUrl 
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
            <div className="relative w-full max-w-4xl bg-[#0f121d] rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[95vh]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 rounded-t-3xl"></div>
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-slate-950/20 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                                <Upload className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Auditoría de <span className="text-emerald-400">Entregas</span>
                                </h2>
                                <p className="text-gray-500 text-[10px] uppercase tracking-widest font-medium">Revisión de la tarea: {assignment.title}</p>
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

                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6">
                    {submissions.length === 0 ? (
                        <div className="text-center py-24 bg-slate-950/30 rounded-3xl border border-white/5 border-dashed flex flex-col items-center">
                            <div className="p-6 bg-slate-800/40 rounded-full mb-6">
                                <AlertTriangle className="w-12 h-12 text-gray-700" />
                            </div>
                            <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Sin entregas arquitectadas aún</p>
                        </div>
                    ) : (
                        submissions.map((sub) => (
                            <div key={sub.id} className="p-6 bg-[#0a0d18] border border-white/5 rounded-3xl flex flex-col lg:flex-row gap-8 hover:border-white/10 transition-all group">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-primary-600 flex items-center justify-center font-black text-white text-lg shadow-lg">
                                            {sub.first_name[0]}{sub.last_name[0]}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg">{sub.first_name} {sub.last_name}</h4>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{sub.email}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-3 mb-6">
                                        <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${
                                            sub.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-lg shadow-emerald-500/5' :
                                            sub.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-lg shadow-red-500/5' :
                                            'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-lg shadow-blue-500/5'
                                        }`}>
                                            {sub.status === 'approved' ? 'Estatus: Validado' : sub.status === 'rejected' ? 'Estatus: Rechazado' : 'Estatus: Pendiente'}
                                        </div>
                                        <div className="w-1 h-1 bg-white/5 rounded-full"></div>
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{new Date(sub.submitted_at).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                    </div>

                                    <div className="flex">
                                        <a 
                                            href={`${apiUrl.replace('/api', '')}${sub.file_url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="group/btn inline-flex items-center gap-3 px-5 py-3 bg-slate-950 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all shadow-xl"
                                        >
                                            <FileText className="w-4 h-4 text-gray-600 group-hover/btn:text-emerald-400" /> Auditoría de Material
                                        </a>
                                    </div>
                                </div>

                                <div className="w-full lg:w-80 space-y-4 bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block ml-1">Observaciones Técnicas</label>
                                        <textarea
                                            className="w-full bg-[#0a0d18] border border-white/5 focus:border-emerald-500/30 rounded-xl p-4 text-xs text-gray-400 font-medium outline-none border transition-all h-24 placeholder:text-gray-800"
                                            placeholder="Añadir feedback para el alumno..."
                                            defaultValue={sub.feedback || ''}
                                            id={`feedback-${sub.id}`}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onGrade(sub.id, 'approved', 100, document.getElementById(`feedback-${sub.id}`).value)}
                                            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-emerald-600/10 text-emerald-500 border border-emerald-500/10 rounded-xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                        >
                                            Validar
                                        </button>
                                        <button
                                            onClick={() => onGrade(sub.id, 'rejected', 0, document.getElementById(`feedback-${sub.id}`).value)}
                                            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {/* Footer simple */}
                <div className="px-8 py-4 border-t border-white/5 bg-slate-950/20 flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="py-2.5 px-6 bg-transparent hover:bg-white/5 text-gray-500 hover:text-white font-bold uppercase tracking-widest rounded-xl transition-all text-[10px]"
                    >
                        Cerrar Auditoría
                    </button>
                </div>
            </div>
        </div>
    );
}
