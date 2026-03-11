import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSoundStore } from '../store/soundStore';

const SoundControl = () => {
    const { isMuted, volume, toggleMute, setVolume } = useSoundStore();
    const [showSlider, setShowSlider] = useState(false);

    return (
        <div className="relative flex items-center gap-2" onMouseEnter={() => setShowSlider(true)} onMouseLeave={() => setShowSlider(false)}>
            <button
                onClick={toggleMute}
                className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center ${
                    isMuted ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-primary-500/10 text-primary-400 hover:bg-primary-500/20'
                }`}
                title={isMuted ? "Activar sonido" : "Silenciar"}
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {showSlider && !isMuted && (
                <div className="absolute top-full right-0 mt-2 p-3 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] w-32 animate-fade-in">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Volumen</span>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <div className="flex justify-between text-[8px] font-bold text-gray-600 uppercase">
                            <span>Min</span>
                            <span>{Math.round(volume * 100)}%</span>
                            <span>Max</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SoundControl;
