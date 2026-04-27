import React from 'react';
import { Award, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function BadgeStatsChart({ data = [], loading }) {
    if (!data || data.length === 0) return null;

    const chartHeight = Math.max(300, data.length * 50);

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4'];

    return (
        <div className="card p-8 space-y-8 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 text-left">
                <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                    <Award className="w-6 h-6 text-yellow-500" />
                    Distribución de Insignias
                </h3>
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
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={180}
                            tick={{ fill: '#94a3b8', fontSize: 10, width: 170 }}
                            interval={0}
                        />
                        <Tooltip
                            cursor={{ fill: '#ffffff05' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const item = payload[0].payload;
                                    return (
                                        <div className="bg-slate-900 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                                            <p className="text-[10px] font-black text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                                                {item.name}
                                            </p>
                                            <div className="flex items-center justify-between gap-8">
                                                <span className="text-[9px] font-black text-gray-400 uppercase">Obtenida por:</span>
                                                <span className="text-[10px] font-black text-yellow-500">{item.earned_count} funcionarios</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="earned_count" radius={[0, 4, 4, 0]} barSize={25}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <LabelList
                                dataKey="earned_count"
                                position="right"
                                style={{ fill: '#ffffff60', fontSize: '11px', fontWeight: 'bold' }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
