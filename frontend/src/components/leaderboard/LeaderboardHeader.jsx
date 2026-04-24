import { Trophy, Crown } from 'lucide-react';
import primaryBanner from '../../assets/primary-banner.svg';

export default function LeaderboardHero({ currentUser }) {
    return (
        <div className="relative rounded-[2rem] overflow-hidden bg-slate-800/20 border border-white/5 shadow-2xl">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={primaryBanner}
                    alt="Hero Background"
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#161b33] via-[#161b33]/80 to-transparent"></div>
            </div>

            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase italic">
                        <span className="inline-block bg-gradient-to-r from-primary-400 via-primary-500 to-secondary-500 bg-clip-text text-transparent py-2">
                            RANKING
                        </span>
                    </h1>
                </div>

                <div className="flex gap-6">
                    {/* Institutional Rank Card */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900/60 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center shadow-xl relative group">
                        <Trophy className="w-5 h-5 text-primary-400 absolute -top-2 opacity-50" />
                        <span className="text-3xl md:text-4xl font-black text-white">#{currentUser?.globalRank || '--'}</span>
                        <span className="text-[9px] font-bold text-gray-500 tracking-widest uppercase text-center px-2">Rango CGR</span>
                    </div>

                    {/* Dept Rank Card */}
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900 rounded-[1.5rem] border-4 border-secondary-500/30 flex flex-col items-center justify-center shadow-2xl relative">
                        <Crown className="w-6 h-6 text-secondary-500 absolute -top-3 -rotate-12 drop-shadow-[0_0_10px_rgba(229,123,60,0.5)]" />
                        <span className="text-3xl md:text-4xl font-black text-white">#{currentUser?.deptRank || '--'}</span>
                        <span className="text-[9px] font-bold text-secondary-500 tracking-widest uppercase text-center px-2">Rango Área</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
