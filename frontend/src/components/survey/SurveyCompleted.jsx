import React from 'react';
import { Star } from 'lucide-react';
import CyberCat from '../CyberCat';
import PointsCounter from '../quiz/PointsCounter';

export default function SurveyCompleted({ pointsEarned, onBack }) {
    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-10">
            <div className="card overflow-hidden border-t-8 border-yellow-500 bg-yellow-500/5">
                <div className="p-6 md:p-8 text-center space-y-4">
                    <div className="flex justify-center -mt-2">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-yellow-500/10 flex items-center justify-center ring-[8px] ring-yellow-500/5 mb-4 backdrop-blur-md relative shadow-[0_0_40px_rgba(234,179,8,0.15)]">
                            <CyberCat
                                className="w-24 h-24 md:w-28 md:h-28 animate-float-subtle"
                                variant="success"
                                color="#eab308"
                            />
                            <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-500/5 blur-xl"></div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">¡Encuesta Completada!</h1>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs md:text-sm">
                            Su retroalimentación es fundamental para mejorar la plataforma.
                        </p>
                    </div>

                    {pointsEarned > 0 && (
                        <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-secondary-500/20 border border-secondary-500/30 rounded-full text-secondary-500 font-black text-[11px] animate-bounce">
                            <Star className="w-3.5 h-3.5 fill-secondary-500" /> +<PointsCounter target={pointsEarned} /> Puntos
                        </div>
                    )}

                    <div className="pt-4 flex flex-col items-center">
                        <button
                            onClick={onBack}
                            className="px-10 py-3.5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl"
                        >
                            Volver a la Lección
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
