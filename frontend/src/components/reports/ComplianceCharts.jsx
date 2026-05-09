import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, ChevronDown, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function ComplianceCharts({ chartType, onTypeChange, data, modules = [], selectedModule, onModuleChange, loading, onBarClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isModuleOpen, setIsModuleOpen] = useState(false);
    const dropdownRef = useRef(null);
    const moduleRef = useRef(null);
    
    // Simple click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
            if (moduleRef.current && !moduleRef.current.contains(event.target)) setIsModuleOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        { value: 'departments', label: 'Por Unidad/Área' },
        { value: 'positions', label: 'Por Puesto' },
        { value: 'modules', label: 'Por Módulo' }
    ];

    const currentOption = options.find(o => o.value === chartType) || options[0];
    const currentModule = modules.find(m => String(m.id) === String(selectedModule)) || { id: 'ALL', title: 'Todos los Módulos' };

    const yDataKey = chartType === 'departments' ? 'department' : (chartType === 'positions' ? 'position' : 'title');

    // Dynamic height based on data length (min 400px, max 1000px)
    const chartHeight = Math.max(400, Math.min(data.length * 40, 1000));

    const getColorForName = (name) => {
        if (!name) return '#cbd5e1';
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return `hsl(${Math.abs(hash) % 360}, 70%, 60%)`;
    };

    return (
        <div className="card p-8 space-y-8 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 text-left">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-primary-400" />
                    {chartType === 'departments' ? 'Cumplimiento por Unidad' : (chartType === 'positions' ? 'Cumplimiento por Puesto' : 'Cumplimiento por Módulo')}
                </h3>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Module Select for Department Chart */}
                    {chartType === 'departments' && (
                        <div className="relative" ref={moduleRef}>
                            <button
                                onClick={() => setIsModuleOpen(!isModuleOpen)}
                                className={`
                                    flex items-center justify-between gap-3 min-w-[200px] px-4 py-2.5
                                    bg-slate-900/50 backdrop-blur-xl border ${isModuleOpen ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'border-white/10'}
                                    rounded-xl text-white text-[9px] font-black uppercase tracking-widest
                                    transition-all duration-300 hover:bg-slate-800/80
                                `}
                            >
                                <span className="truncate max-w-[150px]">{currentModule.title}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isModuleOpen ? 'rotate-180 text-primary-400' : ''}`} />
                            </button>
                            {isModuleOpen && (
                                <div className="absolute right-0 mt-2 w-full z-50 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in slide-in-from-top-2">
                                    <button
                                        onClick={() => { onModuleChange('ALL'); setIsModuleOpen(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-colors ${selectedModule === 'ALL' ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        General (Todos)
                                    </button>
                                    {modules.map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => { onModuleChange(m.id); setIsModuleOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-[9px] font-black uppercase tracking-widest transition-colors ${String(selectedModule) === String(m.id) ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {m.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Custom Premium Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`
                                flex items-center justify-between gap-3 min-w-[220px] px-5 py-2.5
                                bg-slate-900/50 backdrop-blur-xl border ${isOpen ? 'border-primary-500/50 shadow-lg shadow-primary-500/10' : 'border-white/10'}
                                rounded-xl text-white text-[10px] font-black uppercase tracking-widest
                                transition-all duration-300 hover:bg-slate-800/80 hover:border-white/20
                            `}
                        >
                            {currentOption.label}
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-400' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute right-0 mt-2 w-full z-50 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => {
                                            onTypeChange(option.value);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest
                                            transition-colors duration-200
                                            ${chartType === option.value ? 'bg-primary-500/20 text-primary-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div style={{ height: `${chartHeight}px` }} className="w-full relative">
                {loading && (
                    <div className="absolute inset-0 z-10 bg-slate-950/20 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                    </div>
                )}
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        layout="vertical"
                        data={data}
                        margin={{ top: 5, right: 60, left: -20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis
                            dataKey={yDataKey}
                            type="category"
                            width={180}
                            tick={{ fill: '#94a3b8', fontSize: 9, width: 170 }}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: '#ffffff05' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    const count = (chartType === 'departments' || chartType === 'positions') ? data.total_pax : data.total_students;
                                    return (
                                        <div className="bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                                            <p className="text-[10px] font-black text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                                                {data[yDataKey]}
                                            </p>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase">Cumplimiento:</span>
                                                    <span className="text-[10px] font-black text-primary-400">{data.avg_completion}%</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase">Completados:</span>
                                                    <span className="text-[10px] font-black text-white">{data.completed_count || 0}</span>
                                                </div>
                                                <div className="flex items-center justify-between gap-8">
                                                    <span className="text-[9px] font-black text-gray-400 uppercase">Total Funcionarios:</span>
                                                    <span className="text-[10px] font-black text-slate-400">{count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar 
                            dataKey="avg_completion" 
                            radius={[0, 4, 4, 0]} 
                            barSize={20}
                            onClick={(entry) => onBarClick && onBarClick(entry)}
                            className="cursor-pointer"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={getColorForName(entry[yDataKey])}
                                />
                            ))}
                            <LabelList
                                dataKey="avg_completion"
                                position="right"
                                formatter={(val) => `${val}%`}
                                style={{ fill: '#ffffff60', fontSize: '10px', fontWeight: 'bold' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
