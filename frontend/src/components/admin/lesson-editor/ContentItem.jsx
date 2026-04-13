import { 
    MoveUp, 
    MoveDown, 
    Link as LinkIcon, 
    Upload, 
    HelpCircle, 
    ClipboardList, 
    Pencil, 
    Trash2 
} from 'lucide-react';
import { getIconForType, getColorForType, getTypeLabel } from './editorUtils.js';

export default function ContentItem({ 
    item, 
    index, 
    totalItems, 
    onMove, 
    onEdit, 
    onDelete, 
    onConfigQuiz, 
    onConfigSurvey, 
    onViewSubmissions 
}) {
    const IconComponent = getIconForType(item.content_type);
    const iconColor = getColorForType(item.content_type);

    return (
        <div className="group relative flex items-center gap-4 p-5 bg-slate-900/60 border border-white/5 rounded-3xl hover:border-white/10 hover:bg-slate-900 transition-all shadow-xl hover:shadow-primary-500/5">
            {/* Order Controls */}
            <div className="flex flex-col gap-2 opacity-30 group-hover:opacity-100 transition-opacity pr-2 border-r border-white/5">
                <button
                    onClick={() => onMove(index, 'up')}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-primary-500/20 hover:text-primary-400 text-gray-500 rounded-lg disabled:opacity-0 transition-all"
                >
                    <MoveUp className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onMove(index, 'down')}
                    disabled={index === totalItems - 1}
                    className="p-1.5 hover:bg-primary-500/20 hover:text-primary-400 text-gray-500 rounded-lg disabled:opacity-0 transition-all"
                >
                    <MoveDown className="w-4 h-4" />
                </button>
            </div>

            {/* Icon & Info */}
            <div className="p-4 bg-slate-950/50 rounded-2xl group-hover:bg-slate-800 border border-white/5 transition-colors">
                <IconComponent className={`w-5 h-5 ${iconColor}`} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                    <h3 className="font-black text-white text-lg tracking-tight group-hover:text-primary-400 transition-colors uppercase">{item.title}</h3>
                    <div className="flex items-center gap-2">
                        {!!item.is_required && <span className="text-[8px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md border border-red-500/10 uppercase font-black tracking-widest shadow-lg shadow-red-500/5">REQUERIDO</span>}
                        {item.points > 0 && <span className="text-[8px] bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-md border border-yellow-500/10 uppercase font-black tracking-widest shadow-lg shadow-yellow-500/5">{item.points} PTS</span>}
                    </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-primary-500/40 uppercase tracking-widest">{getTypeLabel(item.content_type)}</span>
                    <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                    <span className="text-[10px] font-bold text-gray-600">ID: {item.id}</span>
                </div>

                {/* Data Previews */}
                {item.data?.text && (
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5 mt-2">
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">{item.data.text}</p>
                    </div>
                )}
                {item.content_type === 'interactive_input' && item.data?.description && (
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 uppercase tracking-wider">
                                {item.data.validation_type === 'free' ? 'Reflexión Libre' : item.data.validation_type === 'exact' ? 'Validación Exacta' : 'Validación Regex'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">{item.data.description}</p>
                    </div>
                )}
                {item.content_type === 'password_tester' && item.data?.description && (
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5 mt-2">
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">{item.data.description}</p>
                    </div>
                )}
                {item.content_type === 'mfa_defender' && item.data?.description && (
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 uppercase tracking-wider">
                                {item.data.hack_time || 20}s Límite (Rotación {item.data.rotate_time || 5}s)
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">{item.data.description}</p>
                    </div>
                )}
                {item.content_type === 'multiple_choice' && item.data?.description && (
                    <div className="bg-black/20 p-3 rounded-xl border border-white/5 mt-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 uppercase tracking-wider">
                                {item.data.options?.length || 0} Opciones
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed italic">{item.data.description}</p>
                    </div>
                )}
                {item.data?.url && (
                    <a href={item.data.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-bold text-primary-400/70 hover:text-primary-400 bg-primary-500/5 px-3 py-1.5 rounded-lg border border-primary-500/10 mt-2 transition-all">
                        <LinkIcon className="w-3 h-3" /> {item.data.url}
                    </a>
                )}
                {item.data?.file_url && (
                    <div className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 bg-white/5 py-1.5 px-3 rounded-lg border border-white/5 mt-2">
                        <Upload className="w-3 h-3" /> {item.data.original_name}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-2">
                {item.content_type === 'quiz' && (
                    <button
                        onClick={() => onConfigQuiz(item)}
                        className="p-3 bg-red-400/10 text-red-400 rounded-2xl hover:bg-red-400 hover:text-white transition-all shadow-lg shadow-red-400/5"
                        title="Configurar Cuestionario"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                )}
                {item.content_type === 'survey' && (
                    <button
                        onClick={() => onConfigSurvey(item)}
                        className="p-3 bg-yellow-400/10 text-yellow-400 rounded-2xl hover:bg-yellow-400 hover:text-white transition-all shadow-lg shadow-yellow-400/5"
                        title="Configurar Encuesta"
                    >
                        <ClipboardList className="w-5 h-5" />
                    </button>
                )}
                {item.content_type === 'assignment' && (
                    <button
                        onClick={() => onViewSubmissions(item.id, item.title)}
                        className="p-3 bg-green-400/10 text-green-400 rounded-2xl hover:bg-green-400 hover:text-white transition-all shadow-lg shadow-green-400/5"
                        title="Ver Entregas"
                    >
                        <Upload className="w-5 h-5" />
                    </button>
                )}
                <button
                    onClick={() => onEdit(item)}
                    className="p-3 bg-blue-400/10 text-blue-400 rounded-2xl hover:bg-blue-400 hover:text-white transition-all shadow-lg shadow-blue-400/5"
                    title="Editar Contenido"
                >
                    <Pencil className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(item.id)}
                    className="p-3 bg-red-400/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                    title="Eliminar Contenido"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
