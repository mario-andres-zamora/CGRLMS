import { Video, Youtube } from 'lucide-react';

export default function VideoEditor({ 
    videoSource, 
    onSetSource, 
    file, 
    onSetFile, 
    url, 
    onSetUrl, 
    editingItem 
}) {
    return (
        <div className="space-y-6">
            <div className="flex gap-2 p-1.5 bg-[#0a0d18] rounded-xl border border-white/5">
                {['file', 'url'].map((source) => (
                    <button
                        key={source}
                        type="button"
                        onClick={() => onSetSource(source)}
                        className={`flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${videoSource === source ? 'bg-primary-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        {source === 'file' ? 'Local' : 'Youtube'}
                    </button>
                ))}
            </div>

            {videoSource === 'file' ? (
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Cargar Video</label>
                    <div className="p-8 bg-[#0a0d18] border-2 border-dashed border-white/5 rounded-2xl hover:border-primary-500/30 transition-all flex flex-col items-center justify-center gap-3 relative group">
                        <input
                            type="file"
                            required={!editingItem && !editingItem?.data?.file_url}
                            id="videoFile"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={e => onSetFile(e.target.files[0])}
                            accept="video/*"
                        />
                        <div className="p-3 bg-red-500/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Video className="w-7 h-7 text-red-400" />
                        </div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                            {file ? file.name : editingItem?.data?.original_name || 'Seleccionar MP4'}
                        </span>
                    </div>
                </div>
            ) : (
                <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">URL de Streaming</label>
                    <div className="relative">
                        <input
                            type="url"
                            required
                            className="w-full bg-[#0a0d18] border border-white/5 focus:border-red-500/50 rounded-xl py-3 px-4 pl-12 text-white text-sm font-semibold outline-none transition-all"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={url}
                            onChange={e => onSetUrl(e.target.value)}
                        />
                        <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500/50" />
                    </div>
                </div>
            )}
        </div>
    );
}
