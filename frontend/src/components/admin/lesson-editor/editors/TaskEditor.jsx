export default function TaskEditor({ contentType, value, onChange }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                {contentType === 'note' ? 'Contenido de la Propiedad' :
                 contentType === 'heading' ? 'Texto del Título' : 'Instrucciones / Descripción'}
            </label>
            <textarea
                rows={contentType === 'heading' ? "2" : "4"}
                className="w-full bg-[#0a0d18] border border-white/5 focus:border-primary-500/50 rounded-xl py-3 px-4 text-white text-sm font-medium outline-none transition-all hover:border-white/10 resize-none custom-scrollbar"
                placeholder={contentType === 'note' ? 'Escribe los conceptos clave...' :
                            contentType === 'heading' ? 'Ej: Introducción, Fase 1...' : 'Instrucciones para la actividad...'}
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
