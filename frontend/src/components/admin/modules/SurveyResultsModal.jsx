import React, { useState, useEffect } from 'react';
import { X, BarChart2, MessageSquare, Users, Loader2, Star, PieChart as PieChartIcon, ArrowRight, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, Legend
} from 'recharts';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function SurveyResultsModal({ isOpen, onClose, surveyId }) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && surveyId) {
            fetchAnalytics();
        }
    }, [isOpen, surveyId]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/surveys/lesson/${surveyId}/analytics`);
            setData(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching survey analytics:', err);
            setError('No se pudieron cargar los resultados de la encuesta.');
        } finally {
            setLoading(false);
        }
    };

    const fetchTextPage = async (questionId, page) => {
        try {
            const response = await axios.get(`${API_URL}/surveys/questions/${questionId}/text-answers?page=${page}&limit=5`);
            if (response.data.success) {
                setData(prev => ({
                    ...prev,
                    analytics: prev.analytics.map(q => 
                        q.questionId === questionId 
                            ? { 
                                ...q, 
                                data: { 
                                    ...q.data, 
                                    answers: response.data.answers, 
                                    page: response.data.pagination.page 
                                } 
                            } 
                            : q
                    )
                }));
            }
        } catch (err) {
            console.error('Error fetching text page:', err);
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await axios.get(`${API_URL}/surveys/lesson/${surveyId}/export`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Resultados_${data.survey.title.replace(/[^a-z0-9]/gi, '_')}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Error exporting CSV:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#0f111a] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-zoom-in">
                
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                            <BarChart2 className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight italic">
                                Resultados de Encuesta
                            </h2>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                                {data?.survey?.title || 'Analíticas Agregadas'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {data && (
                            <div className="hidden md:flex items-center gap-6 pr-6 border-r border-white/5">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Total Respuestas</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <Users className="w-3.5 h-3.5 text-blue-400" />
                                        <span className="text-lg font-black text-white">{data.survey.totalResponses}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        {data && (
                            <button
                                onClick={handleExportCSV}
                                title="Descargar resultados en CSV"
                                className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-blue-500/10 group active:scale-95"
                            >
                                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                <span className="hidden sm:inline">Exportar CSV</span>
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all border border-white/5 active:scale-90"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                            <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] italic">Calculando estadísticas...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20">
                            <p className="text-red-400 font-bold">{error}</p>
                            <button 
                                onClick={fetchAnalytics}
                                className="mt-4 text-blue-400 hover:underline text-sm font-bold"
                            >
                                Reintentar
                            </button>
                        </div>
                    ) : data.survey.totalResponses === 0 ? (
                        <div className="text-center py-20 opacity-40">
                            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 font-black uppercase tracking-widest">Aún no hay respuestas registradas</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            {data.analytics.map((q, idx) => (
                                <div 
                                    key={q.questionId}
                                    className={`p-6 rounded-[2rem] bg-slate-900/40 border border-white/5 hover:border-white/10 transition-colors ${
                                        q.type === 'text' ? 'md:col-span-2' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-gray-500 border border-white/5">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-1 leading-tight">
                                                {q.text}
                                            </h4>
                                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                                                {q.type === 'rating' && <Star className="w-3 h-3 text-amber-500" />}
                                                {q.type === 'multiple_choice' && <PieChartIcon className="w-3 h-3 text-emerald-500" />}
                                                {q.type === 'text' && <MessageSquare className="w-3 h-3 text-blue-500" />}
                                                {q.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Charts */}
                                    <div className="min-h-[250px] w-full mt-4">
                                        {q.type === 'rating' && (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart data={q.data}>
                                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                                    <XAxis 
                                                        dataKey="label" 
                                                        stroke="#475569" 
                                                        fontSize={10} 
                                                        fontWeight="bold"
                                                        axisLine={false}
                                                        tickLine={false}
                                                    />
                                                    <YAxis hide />
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                                    />
                                                    <Bar 
                                                        dataKey="value" 
                                                        fill="#3b82f6" 
                                                        radius={[6, 6, 0, 0]}
                                                        label={{ position: 'top', fill: '#64748b', fontSize: 10, fontWeight: 'black' }}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        )}

                                        {q.type === 'multiple_choice' && (
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart>
                                                    <Pie
                                                        data={q.data}
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {q.data.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip 
                                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                        itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                                    />
                                                    <Legend 
                                                        verticalAlign="bottom" 
                                                        align="center"
                                                        iconType="circle"
                                                        formatter={(value) => <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{value}</span>}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        )}

                                        {q.type === 'text' && (
                                            <div className="space-y-4">
                                                <div className="space-y-3">
                                                    {q.data?.answers?.map((item, i) => (
                                                        <div key={i} className="group/msg flex items-start gap-4 p-4 bg-slate-950/40 rounded-2xl border border-white/5 hover:border-blue-500/20 transition-all animate-fade-in">
                                                            <div className="mt-1">
                                                                <ArrowRight className="w-3 h-3 text-blue-500/50 group-hover/msg:translate-x-1 transition-transform" />
                                                            </div>
                                                            <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
                                                                "{item.text}"
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Pagination Controls */}
                                                {q.data?.totalPages > 1 && (
                                                    <div className="pt-4 flex items-center justify-between border-t border-white/5">
                                                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                            Página {q.data.page} de {q.data.totalPages}
                                                        </span>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => fetchTextPage(q.questionId, q.data.page - 1)}
                                                                disabled={q.data.page === 1}
                                                                className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-white/5"
                                                            >
                                                                <ChevronLeft className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => fetchTextPage(q.questionId, q.data.page + 1)}
                                                                disabled={q.data.page === q.data.totalPages}
                                                                className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-white rounded-xl transition-all border border-white/5"
                                                            >
                                                                <ChevronRight className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-950/50 border-t border-white/5 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/5 active:scale-95"
                    >
                        Cerrar Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
