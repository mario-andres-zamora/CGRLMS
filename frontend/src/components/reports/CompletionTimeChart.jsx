import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function CompletionTimeChart({ data = [] }) {
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Only show modules that have some data (avg_time > 0)
    const chartData = data
        .filter(m => (m.avg_time || 0) > 0)
        .sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

    const maxTime = Math.max(...chartData.map(m => m.avg_time || 0), 1);

    const formatTime = (minutes) => {
        if (!minutes || minutes <= 0) return '0m';
        if (minutes < 60) return `${Math.round(minutes)}m`;

        const hours = minutes / 60;
        if (hours < 24) {
            const h = Math.floor(hours);
            const m = Math.round((hours - h) * 60);
            return m > 0 ? `${h}h ${m}m` : `${h}h`;
        }

        const days = hours / 24;
        const d = Math.floor(days);
        const h = Math.round((days - d) * 24);
        return h > 0 ? `${d}d ${h}h` : `${d}d`;
    };

    const getColorForValue = (minutes) => {
        if (minutes < 60) return 'bg-emerald-500';
        if (minutes < 1440) return 'bg-primary-500';
        return 'bg-amber-500';
    };

    if (chartData.length === 0) return null;

    return (
        <div className="card p-6 flex flex-col gap-6 relative overflow-hidden group border border-white/5 hover:border-white/10 transition-colors duration-500">
            {/* Background Icon Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:scale-110 group-hover:opacity-[0.04] transition-all duration-700">
                <Clock className="w-40 h-40 text-white" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between relative z-10">
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.25em] flex items-center gap-2">
                    <span className="p-1.5 bg-primary-500/10 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-primary-400" />
                    </span>
                    Tiempos Promedio
                </h3>
            </div>

            {/* Bars List */}
            <div className="relative z-10 space-y-7 max-h-[400px] overflow-y-auto pr-3 custom-scrollbar">
                {chartData.map((module) => {
                    const percentage = (module.avg_time / maxTime) * 100;
                    return (
                        <div key={module.id} className="space-y-2.5 group/item">
                            <div className="flex flex-col gap-2.5">
                                <div className="flex justify-between items-start gap-4">
                                    <span className="text-[10px] font-black text-slate-400 group-hover/item:text-slate-100 uppercase tracking-widest transition-colors leading-relaxed flex-1">
                                        Módulo {module.order_index}: {module.title}
                                    </span>
                                    <span className="text-[10px] font-black text-primary-400 whitespace-nowrap bg-primary-500/10 px-2 py-1 rounded-md border border-primary-500/10 shadow-sm">
                                        {formatTime(module.avg_time)}
                                    </span>
                                </div>

                                {/* Thicker, Animated, Solid Color Bar */}
                                <div className="h-3 w-full bg-slate-900 rounded-lg overflow-hidden border border-white/5 relative">
                                    <div
                                        className={`h-full ${getColorForValue(module.avg_time)} rounded-lg relative transition-all duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1) shadow-[0_0_15px_rgba(0,0,0,0.3)]`}
                                        style={{ width: animated ? `${percentage}%` : '0%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


        </div>
    );
}
