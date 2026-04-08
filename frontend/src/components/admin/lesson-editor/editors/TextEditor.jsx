export default function TextEditor({ value, onChange }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Contenido (Texto)</label>
            <textarea
                required
                rows="8"
                className="w-full bg-[#0a0d18] border border-white/5 focus:border-primary-500/50 rounded-2xl p-4 text-white text-sm outline-none transition-all hover:border-white/10 resize-none font-mono custom-scrollbar"
                placeholder="Escribe el contenido aquí..."
                value={value}
                onChange={e => onChange(e.target.value)}
            />
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest ml-1">Se muestra tal cual al estudiante.</p>
        </div>
    );
}
