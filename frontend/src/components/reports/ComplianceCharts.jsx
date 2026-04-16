import React, { useState, useRef, useEffect } from 'react';
import { BarChart3, ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function ComplianceCharts({ chartType, onTypeChange, data }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const yDataKey = chartType === 'departments' ? 'department' : 'title';

    // Simple click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        { value: 'departments', label: 'Por Unidad/Área' },
        { value: 'modules', label: 'Por Módulo' }
    ];

    const currentOption = options.find(o => o.value === chartType) || options[1];

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
        <div className="card p-8 space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4 text-left">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <BarChart3 className="w-6 h-6 text-primary-400" />
                    {chartType === 'departments' ? 'Cumplimiento por Unidad' : 'Cumplimiento por Módulo'}
                </h3>

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
            <div style={{ height: `${chartHeight}px` }} className="w-full">
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
                                    const count = chartType === 'departments' ? data.total_pax : data.total_students;
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
                                                    <span className="text-[9px] font-black text-gray-400 uppercase">Total Funcionarios:</span>
                                                    <span className="text-[10px] font-black text-white">{count}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="avg_completion" radius={[0, 4, 4, 0]} barSize={20}>
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
