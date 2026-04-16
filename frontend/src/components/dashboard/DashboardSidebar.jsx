import { TrendingUp, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardSidebar({ user, stats, onShowBadges }) {
    return (
        <div className="space-y-6 flex flex-col h-full animate-fade-in text-center">
            {/* Main Posición Global Card */}
            <div className="bg-[#111627] rounded-3xl p-8 border border-white/5 flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-6">
                    <div className="w-28 h-28 rounded-full bg-slate-800 p-1">
                        <img
                            src={user?.profilePicture || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=384A99&color=fff`}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    {/* Badge */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#EF8843] rounded-full flex items-center justify-center font-bold text-white text-sm border-2 border-[#111627]">
                        #{stats?.rank || 1}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-white uppercase tracking-wider mb-2 leading-none">
                    POSICIÓN<br />GLOBAL
                </h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-8">
                    DE {stats?.totalUsers || 695} FUNCIONARIOS
                </p>

                {/* Inner Stats Card */}
                <div className="w-full bg-[#0B0F1C] rounded-2xl border border-white/5 p-4 flex flex-col gap-4 mb-8">
                    <div className="flex-1 flex flex-col items-center justify-center border-b border-white/5 pb-4">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">INSTITUCIONAL</span>
                        <span className="text-2xl font-bold text-[#EF8843] mb-0.5 leading-none">#{stats?.rank || 1}</span>
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">TOP {Math.max(1, Math.round((stats?.rank / stats?.totalUsers) * 100)) || 1}%</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">EN SU ÁREA</span>
                        <span className="text-2xl font-bold text-[#6D71F9] mb-0.5 leading-none">#{stats?.departmentRank || 6}</span>
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">DE 6 PERS.</span>
                    </div>
                </div>

                <Link 
                    to="/leaderboard" 
                    className="group relative w-full py-4 rounded-2xl border border-primary-500/20 bg-primary-500/5 hover:bg-primary-500/10 transition-all duration-300 text-white text-[10px] font-black uppercase tracking-normal flex items-center justify-center gap-2 overflow-hidden shadow-lg hover:shadow-primary-500/20 hover:border-primary-500/50 px-4"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    <span className="relative z-10 whitespace-nowrap">VER TABLA COMPLETA</span> 
                    <TrendingUp className="w-4 h-4 text-primary-400 relative z-10 transition-all duration-300 group-hover:scale-110 shrink-0" />
                </Link>
            </div>

            {/* Badges / Diplomas Grid */}
            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={onShowBadges}
                    className="bg-[#111627] rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition-colors w-full"
                >
                    <Award className="w-8 h-8 text-[#EF8843]" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">INSIGNIAS</span>
                </button>
                <Link to="/profile" className="bg-[#111627] rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition-colors">
                    <CheckCircle className="w-8 h-8 text-[#6D71F9]" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">DIPLOMAS</span>
                </Link>
            </div>
        </div>
    );
}
