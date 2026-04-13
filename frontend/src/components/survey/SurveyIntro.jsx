import React from 'react';
import { ArrowLeft, ClipboardList, MessageSquare, Star, ChevronRight } from 'lucide-react';

export default function SurveyIntro({ survey, questionsCount, onStart, onBack }) {
    return (
        <div className="w-full px-4 sm:px-6 lg:px-12 space-y-8 animate-fade-in py-10">
            <div className="max-w-4xl mx-auto space-y-8 text-left">
                <div className="space-y-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" /> Cancelar y Volver
                    </button>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tight leading-none">
                        {survey.title}
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full"></div>
                </div>

                <div className="card p-10 space-y-8 border-yellow-500/20 shadow-2xl shadow-yellow-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-bl-full blur-3xl"></div>

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 rounded-full border border-yellow-500/20">
                            <ClipboardList className="w-4 h-4 text-yellow-500" />
                            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Instrucciones de la Encuesta</span>
                        </div>

                        <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed italic border-l-4 border-yellow-500/40 pl-8 py-2">
                            {survey.description || 'Su opinión es muy importante. Por favor, tómese un momento para responder estas preguntas.'}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-4 text-gray-400">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                    <MessageSquare className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Puntos por Completar</p>
                                    <p className="text-lg font-bold text-white">{survey.points || 0} PTS</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-400">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                    <Star className="w-6 h-6 text-yellow-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total de Preguntas</p>
                                    <p className="text-lg font-bold text-white">{questionsCount} Ítems</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-center pt-4">
                    <button
                        onClick={onStart}
                        className="px-12 py-5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:from-yellow-500 hover:to-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-yellow-500/40 group flex items-center gap-3"
                    >
                        Iniciar Encuesta <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
