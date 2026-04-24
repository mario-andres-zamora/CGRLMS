import primaryBanner from '../../assets/primary-banner.svg';

export default function DashboardBanner({ user, stats }) {
    return (
        <div className="space-y-2 md:space-y-3">
            {/* Banner Principal del Curso */}
            <div className="relative w-full h-24 md:h-32 rounded-[1.5rem] overflow-hidden bg-[#161b33] border border-white/5 shadow-2xl">
                <img
                    src={primaryBanner}
                    alt="Banner Principal del Curso"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.5rem]"></div>
            </div>

            {/* Master Welcome Banner */}
            <div className="relative rounded-[1.5rem] overflow-hidden bg-slate-800/20 border border-white/5 shadow-2xl group">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"
                        alt="Dashboard Hero"
                        className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-10000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#161b33] via-[#161b33]/60 to-transparent"></div>
                </div>

                <div className="relative z-10 px-4 py-3 md:px-8 md:py-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none italic uppercase">
                            ¡Hola de nuevo, <span className="text-primary-400 not-italic">{user?.firstName}</span>!
                        </h1>

                    </div>

                    {/* Quick Stats Floating in Banner */}
                    <div className="flex gap-4 md:gap-8">
                        <div className="glass-card px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-center min-w-[120px] shadow-2xl">
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-0.5 italic">Puntos</p>
                            <p className="text-2xl font-black text-white tracking-tighter">{stats?.points || 0}</p>
                        </div>
                        <div className="glass-card px-6 py-3 bg-primary-500/10 backdrop-blur-xl border border-primary-500/20 rounded-2xl text-center min-w-[120px] shadow-[0_0_40px_rgba(37,99,235,0.1)]">
                            <p className="text-[9px] font-black text-primary-400 uppercase tracking-[0.3em] mb-0.5 italic">Nivel</p>
                            <p className="text-2xl font-black text-secondary-500 tracking-tighter">{user?.level || '1'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
