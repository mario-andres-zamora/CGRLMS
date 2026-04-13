import React from 'react';
import { Download, FileText, ExternalLink } from 'lucide-react';

export default function ModuleResources({ resources, onDownload }) {
    return (
        <div className="card bg-slate-800/40 p-8 space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                <Download className="w-5 h-5 text-primary-400" />
                Recursos Adicionales
            </h3>
            {resources && resources.length > 0 ? (
                <div className="space-y-3">
                    {resources.map((resource) => (
                        <a
                            key={resource.id}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onDownload(resource)}
                            className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-primary-500/30 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all 
                                    ${resource.resource_type === 'drive'
                                        ? 'bg-blue-600/10 border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                        : 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                                    {resource.resource_type === 'drive' ? (
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform group-hover:scale-110" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.71 3.502L1.15 14.782L4.44 20.492L11 9.212L7.71 3.502Z" fill="#FFC107" />
                                            <path d="M22.85 14.782L19.56 20.492H6.44L9.73 14.782H22.85Z" fill="#4CAF50" />
                                            <path d="M16.2 3.502H9.71L6.42 9.212L12.91 9.212L16.2 3.502Z" fill="#2196F3" />
                                        </svg>
                                    ) : (
                                        <FileText className="w-5 h-5" />
                                    )}
                                </div>
                                <div className={`text-sm font-bold transition-colors uppercase tracking-tight 
                                    ${resource.resource_type === 'drive' ? 'text-white group-hover:text-blue-400' : 'text-white group-hover:text-red-400'}`}>
                                    {resource.title}
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-primary-400" />
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm font-medium italic">No hay recursos adicionales para este módulo.</p>
            )}
        </div>
    );
}
