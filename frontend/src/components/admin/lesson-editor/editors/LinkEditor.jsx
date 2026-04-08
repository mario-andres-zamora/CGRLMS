import { Link as LinkIcon } from 'lucide-react';

export default function LinkEditor({ value, onChange }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">URL del Enlace</label>
            <input
                type="url"
                required
                className="w-full bg-[#0a0d18] border border-white/5 focus:border-primary-500/50 rounded-xl py-3 px-4 text-white text-sm font-semibold outline-none transition-all hover:border-white/10"
                placeholder="https://..."
                value={value}
                onChange={e => onChange(e.target.value)}
            />
        </div>
    );
}
