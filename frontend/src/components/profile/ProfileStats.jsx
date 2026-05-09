import React from 'react';
import { Trophy, Star, Percent } from 'lucide-react';

const stats_config = [
    {
        key: 'progress',
        icon: Percent,
        color: 'primary',
        label: 'Avance Global',
        getValue: (stats, progress) => `${progress.percentage}%`,
    },
    {
        key: 'rank',
        icon: Trophy,
        color: 'blue',
        label: 'Ranking Institucional',
        getValue: (stats) => `#${stats.rank || '--'}`,
    },
    {
        key: 'deptRank',
        icon: Star,
        color: 'secondary',
        label: 'Ranking en su Área',
        getValue: (stats) => `#${stats.departmentRank || '--'}`,
    },
];

const colorMap = {
    primary: {
        bg: 'bg-primary-500/8',
        border: 'border-primary-500/15',
        iconBg: 'bg-primary-500/10',
        iconBorder: 'border-primary-500/20',
        iconColor: 'text-primary-500',
        accent: 'from-primary-500',
        hover: 'hover:border-primary-500/30 hover:shadow-primary-500/8',
    },
    blue: {
        bg: 'bg-blue-500/8',
        border: 'border-blue-500/15',
        iconBg: 'bg-blue-500/10',
        iconBorder: 'border-blue-500/20',
        iconColor: 'text-blue-500',
        accent: 'from-blue-500',
        hover: 'hover:border-blue-500/30 hover:shadow-blue-500/8',
    },
    secondary: {
        bg: 'bg-secondary-500/8',
        border: 'border-secondary-500/15',
        iconBg: 'bg-secondary-500/10',
        iconBorder: 'border-secondary-500/20',
        iconColor: 'text-secondary-500',
        accent: 'from-secondary-500',
        hover: 'hover:border-secondary-500/30 hover:shadow-secondary-500/8',
    },
};

export default function ProfileStats({ stats, progress }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {stats_config.map(({ key, icon: Icon, color, label, getValue }) => {
                const c = colorMap[color];
                return (
                    <div
                        key={key}
                        className={`relative overflow-hidden rounded-2xl border ${c.border} ${c.bg} p-5 flex flex-col items-center text-center gap-3 transition-all duration-300 shadow-sm ${c.hover} hover:shadow-md hover:-translate-y-0.5 group`}
                    >
                        {/* Top accent line */}
                        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${c.accent} to-transparent opacity-60`} />

                        <div className={`w-11 h-11 rounded-xl ${c.iconBg} border ${c.iconBorder} flex items-center justify-center ${c.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                            <Icon className="w-5 h-5" />
                        </div>

                        <div>
                            <p className={`text-3xl font-black ${c.iconColor} leading-none tracking-tighter`}>
                                {getValue(stats, progress)}
                            </p>
                            <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1.5">
                                {label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
