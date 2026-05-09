import { ChevronRight, Search } from 'lucide-react';

export default function LeaderboardControls({
    view,
    setView,
    levels,
    filterLevel,
    setFilterLevel,
    isFilterOpen,
    setIsFilterOpen,
    searchTerm,
    setSearchTerm
}) {
    const currentLevel = levels.find(l => l.id === filterLevel) || levels[0];

    return (
        <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 items-center justify-between">
            <div className="flex flex-col lg:flex-row w-full xl:w-auto gap-4">
                {/* View Switcher Tabs — institutional dark navy */}
                <div className="flex flex-col sm:flex-row w-full flex-1 p-1 bg-[#0d1127] rounded-2xl border border-white/5 items-stretch gap-1 sm:gap-0 h-[58px] shadow-md">
                    <button
                        onClick={() => setView('global')}
                        className={`flex-1 px-4 lg:px-6 h-full rounded-xl text-[10px] whitespace-nowrap font-black uppercase tracking-widest transition-all ${view === 'global' ? 'bg-primary-500 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        Institucional
                    </button>
                    <button
                        onClick={() => setView('area')}
                        className={`flex-1 px-4 lg:px-6 h-full rounded-xl text-[10px] whitespace-nowrap font-black uppercase tracking-widest transition-all ${view === 'area' ? 'bg-primary-500 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        Mi Área
                    </button>
                    <button
                        onClick={() => setView('strategic')}
                        className={`flex-1 px-4 lg:px-6 h-full rounded-xl text-[10px] whitespace-nowrap font-black uppercase tracking-widest transition-all ${view === 'strategic' ? 'bg-secondary-500 text-white shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                        Por Áreas
                    </button>
                </div>

                {/* Level Filter Dropdown — institutional dark navy */}
                {view !== 'strategic' && (
                    <div className="relative w-full lg:w-64">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full flex items-center justify-between px-6 py-4 bg-[#0d1127] border border-white/5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#1a2347] transition-all shadow-md group"
                        >
                            <div className="flex items-center gap-3">
                                <currentLevel.icon className="w-4 h-4 text-primary-400" />
                                <span>{currentLevel.name}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isFilterOpen ? '-rotate-90' : 'rotate-90'}`} />
                        </button>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0d1127] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                                    <div className="max-h-80 overflow-y-auto custom-scrollbar p-1">
                                        {levels.map((level) => (
                                            <button
                                                key={level.id}
                                                onClick={() => {
                                                    setFilterLevel(level.id);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterLevel === level.id ? 'bg-primary-500 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                <level.icon className={`w-4 h-4 ${filterLevel === level.id ? 'text-white' : 'text-white/40'}`} />
                                                {level.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Search Input — institutional dark navy */}
            <div className="relative w-full xl:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-hover:text-primary-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-[#0d1127] border border-white/5 rounded-2xl text-white font-medium placeholder:text-white/30 focus:outline-none focus:border-primary-500/50 transition-all shadow-md"
                />
            </div>
        </div>
    );
}
