import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Calendar, Filter, ChevronDown, Check, Download } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function CompletionTrend({ modules = [] }) {
    const [selectedModule, setSelectedModule] = useState('');
    const [interval, setInterval] = useState('daily');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Dropdown States
    const [isModuleOpen, setIsModuleOpen] = useState(false);
    const [isIntervalOpen, setIsIntervalOpen] = useState(false);
    const moduleRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (moduleRef.current && !moduleRef.current.contains(event.target)) setIsModuleOpen(false);
            if (intervalRef.current && !intervalRef.current.contains(event.target)) setIsIntervalOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!selectedModule) return;
        if (interval === 'custom' && (!startDate || !endDate)) return;
        
        const fetchTrend = async () => {
            setLoading(true);
            try {
                let url = `${API_URL}/reports/completion-trend?module_id=${selectedModule}&interval=${interval}`;
                if (interval === 'custom') {
                    url += `&startDate=${startDate}&endDate=${endDate}`;
                }

                const response = await axios.get(url, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching trend:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrend();
    }, [selectedModule, interval, startDate, endDate]);

    const intervalOptions = [
        { value: 'daily', label: 'Diario' },
        { value: 'weekly', label: 'Semanal' },
        { value: 'monthly', label: 'Mensual' },
        { value: 'yearly', label: 'Anual' },
        { value: 'custom', label: 'Rango de fechas' }
    ];

    const currentModule = modules.find(m => String(m.id) === String(selectedModule));
    const currentInterval = intervalOptions.find(o => o.value === interval);

    const handleDownloadCSV = async () => {
        if (!selectedModule) return;
        setDownloading(true);
        try {
            const response = await axios.get(`${API_URL}/reports/module-completions-detail?module_id=${selectedModule}`, {
                withCredentials: true
            });
            
            if (response.data.success && response.data.data.length > 0) {
                const csvData = response.data.data.map(row => ({
                    Nombre: row.full_name,
                    Correo: row.email,
                    Modulo: row.module_name,
                    'Fecha de Finalizacion': new Date(row.completion_date).toLocaleString('es-CR')
                }));

                const headers = Object.keys(csvData[0]);
                const csvRows = [
                    headers.join(','),
                    ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
                ].join('\n');

                const blob = new Blob(["\ufeff" + csvRows], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                if (link.download !== undefined) {
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', `finalizaciones_${currentModule?.title?.replace(/\s+/g, '_') || 'modulo'}.csv`);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        } catch (error) {
            console.error('Error downloading CSV:', error);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="card p-8 space-y-6">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-primary-400" /> Tendencia de Finalización
                </h3>

                <div className="flex flex-wrap items-center gap-4">
                    {/* Custom Module Dropdown */}
                    <div className="relative" ref={moduleRef}>
                        <button
                            onClick={() => setIsModuleOpen(!isModuleOpen)}
                            className={`
                                flex items-center justify-between gap-3 min-w-[280px] px-5 py-2.5
                                bg-slate-900 border ${isModuleOpen ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'border-white/10'}
                                rounded-xl text-white text-[10px] font-black uppercase tracking-widest
                                transition-all duration-300 hover:bg-slate-800/80
                            `}
                        >
                            <span className="truncate max-w-[220px]">{currentModule?.title || 'Seleccionar Módulo'}</span>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isModuleOpen ? 'rotate-180 text-primary-400' : ''}`} />
                        </button>
                        {isModuleOpen && (
                            <div className="absolute left-0 mt-2 w-full z-50 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                                {modules.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => {
                                            setSelectedModule(m.id);
                                            setIsModuleOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${String(selectedModule) === String(m.id) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span className="truncate">{m.title}</span>
                                        {String(selectedModule) === String(m.id) && <Check className="w-3 h-3 flex-shrink-0 ml-2" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Custom Interval Dropdown */}
                    <div className="relative" ref={intervalRef}>
                        <button
                            onClick={() => setIsIntervalOpen(!isIntervalOpen)}
                            className={`
                                flex items-center justify-between gap-3 min-w-[180px] px-5 py-2.5
                                bg-slate-900 border ${isIntervalOpen ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'border-white/10'}
                                rounded-xl text-white text-[10px] font-black uppercase tracking-widest
                                transition-all duration-300 hover:bg-slate-800/80
                            `}
                        >
                            {currentInterval?.label || 'Intervalo'}
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isIntervalOpen ? 'rotate-180 text-primary-400' : ''}`} />
                        </button>
                        {isIntervalOpen && (
                            <div className="absolute left-0 mt-2 w-full z-50 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                                {intervalOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => {
                                            setInterval(opt.value);
                                            setIsIntervalOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${interval === opt.value ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {opt.label}
                                        {interval === opt.value && <Check className="w-3 h-3 flex-shrink-0 ml-2" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {interval === 'custom' && (
                        <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-400">
                            <div className="relative">
                                <input 
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-slate-900 border border-white/10 text-white text-[9px] font-black uppercase rounded-xl pl-8 pr-4 py-2 focus:border-primary-500/50 outline-none appearance-none cursor-pointer"
                                />
                                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-primary-500/50 pointer-events-none" />
                            </div>
                            <span className="text-gray-600 text-[10px] font-black uppercase">a</span>
                            <div className="relative">
                                <input 
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-slate-900 border border-white/10 text-white text-[9px] font-black uppercase rounded-xl pl-8 pr-4 py-2 focus:border-primary-500/50 outline-none appearance-none cursor-pointer"
                                />
                                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-primary-500/50 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Download CSV Button */}
                    <button
                        onClick={handleDownloadCSV}
                        disabled={!selectedModule || downloading}
                        className={`
                            flex items-center gap-2 px-5 py-2.5
                            bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest
                            transition-all duration-300 hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/25
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
                        {downloading ? 'Descargando...' : 'Descargar Detalle'}
                    </button>
                </div>
            </div>

            <div className="h-72 w-full relative">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-slate-950/20 backdrop-blur-sm flex items-center justify-center rounded-xl">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                
                {data.length === 0 && !loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-2 border border-white/5 border-dashed rounded-2xl bg-white/5">
                        <TrendingUp className="w-8 h-8 opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Esperando datos de tendencia...</span>
                        {interval === 'custom' && (!startDate || !endDate) && (
                            <span className="text-[8px] text-primary-500/60 uppercase font-black">Selecciona un rango de fechas válido</span>
                        )}
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                            <XAxis 
                                dataKey="label" 
                                stroke="#475569" 
                                fontSize={9} 
                                tickLine={false} 
                                axisLine={false}
                                dy={10}
                                tick={{ fill: '#94a3b8', fontWeight: '900' }}
                            />
                            <YAxis 
                                stroke="#475569" 
                                fontSize={9} 
                                tickLine={false} 
                                axisLine={false}
                                allowDecimals={false}
                                tick={{ fill: '#94a3b8', fontWeight: '900' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                                itemStyle={{ color: '#0ea5e9', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                labelStyle={{ color: '#fff', fontSize: '10px', marginBottom: '8px', borderBottom: '1px solid #ffffff10', paddingBottom: '4px', fontWeight: '900' }}
                                cursor={{ fill: '#ffffff05' }}
                            />
                            <Bar 
                                dataKey="value" 
                                name="Finalizaciones"
                                radius={[6, 6, 0, 0]}
                                animationDuration={1000}
                                barSize={interval === 'daily' ? 30 : 20}
                            >
                                {data.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill="#0ea5e9"
                                        fillOpacity={0.8}
                                        className="transition-all duration-300 hover:fill-opacity-100"
                                        style={{ filter: 'drop-shadow(0 0 8px rgba(14, 165, 233, 0.3))' }}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
