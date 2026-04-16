import React from 'react';
import { PieChart as PieIcon, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function DistributionPie({ avgCompletion, summary }) {
    const pieData = [
        { name: 'Terminado', value: summary.completed || 0, color: '#10b981' }, // Green
        { name: 'En Progreso', value: summary.inProgress || 0, color: '#f59e0b' }, // Yellow
        { name: 'Pendiente Registro', value: summary.pendingRegistration || 0, color: '#ef4444' } // Red
    ];

    return (
        <div className="card p-8 space-y-6 text-left">
            <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-3">
                <PieIcon className="w-5 h-5 text-secondary-500" /> Distribución Global
            </h3>
            <div className="h-64 flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-white">{avgCompletion}%</span>
                    <span className="text-[8px] font-black text-gray-500 uppercase">Logrado</span>
                </div>
            </div>
            <div className="space-y-3">
                {pieData.map((p, i) => {
                    const percentage = summary.totalStaff > 0
                        ? Math.round((p.value / summary.totalStaff) * 100)
                        : 0;
                    return (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                                <span className="text-[10px] font-black text-gray-400 uppercase">{p.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black text-white">{p.value}</span>
                                <span className="text-[8px] font-black text-gray-600">({percentage}%)</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
