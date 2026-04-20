import { ChevronLeft, ChevronRight, ChevronDown, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ParticipantListView({
    view,
    participants,
    loggedUser,
    currentUser,
    setView
}) {

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isPerPageOpen, setIsPerPageOpen] = useState(false);

    // Reset page to 1 when filters, view, search terms, or items per page change
    useEffect(() => {
        setCurrentPage(1);
    }, [participants, view, itemsPerPage]);


    const totalPages = Math.ceil(participants.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedParticipants = participants.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="grid grid-cols-12 px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <div className="col-span-2 md:col-span-1 text-center">Posición</div>
                    <div className="col-span-4 md:col-span-5 px-6">Funcionario</div>
                    <div className="hidden md:block col-span-3 text-center">Área / Unidad</div>
                    <div className="col-span-6 md:col-span-3 text-right">Puntaje</div>
                </div>

                {paginatedParticipants.map((p) => {
                    const isMe = p.email === loggedUser?.email?.toLowerCase();
                    return (
                        <div key={p.id} className={`grid grid-cols-12 items-center px-8 py-5 rounded-3xl border transition-all ${isMe ? 'bg-primary-500/10 border-primary-500/30 ring-1 ring-primary-500/20 shadow-xl' : 'bg-slate-800/20 border-white/5 hover:border-white/10 hover:bg-slate-800/30'}`}>
                            <div className={`col-span-2 md:col-span-1 flex flex-col items-center justify-center font-black ${isMe ? 'text-primary-400' : 'text-gray-400'}`}>
                                <span className="text-xl md:text-md leading-none italic">{p.rank_position}</span>
                                {view !== 'global' && p.institutional_rank && (
                                    <div className={`flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-lg border shadow-sm transition-all ${isMe ? 'bg-primary-500/20 border-primary-500/40 text-primary-300' : 'bg-slate-700/50 border-white/10 text-slate-200'}`}>
                                        <Trophy className="w-3 h-3 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.4)]" />
                                        <span className="text-[10px] font-black uppercase tracking-tight">#{p.institutional_rank}</span>
                                    </div>
                                )}
                            </div>
                            <div className="col-span-4 md:col-span-5 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-white/5">
                                    <img src={(isMe ? loggedUser?.profilePicture : p.profile_picture) || `https://ui-avatars.com/api/?name=${p.first_name}+${p.last_name}&background=384A99&color=fff`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="px-2">
                                    <p className={`font-black uppercase text-sm ${isMe ? 'text-primary-400' : 'text-white'}`}>
                                        {p.first_name} {p.last_name}
                                        {isMe && <span className="ml-2 text-[8px] bg-primary-500 text-white px-1.5 py-0.5 rounded">TÚ</span>}
                                    </p>
                                    <p className={`text-[10px] ${isMe ? 'text-white/60' : 'text-gray-300'} font-bold uppercase md:hidden italic`}>{p.department}</p>
                                </div>
                            </div>
                            <div className={`hidden md:block col-span-3 text-center text-[10px] font-bold ${isMe ? 'text-white/60' : 'text-gray-300'} uppercase italic leading-tight`}>{p.department}</div>
                            <div className="col-span-6 md:col-span-3 text-right">
                                <p className="text-xl font-black text-primary-400 italic leading-none">{p.points} PTS</p>
                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">{p.level}</p>
                            </div>
                        </div>
                    );
                })}

                {participants.length === 0 && (
                    <div className="py-12 text-center text-gray-500 text-sm font-bold uppercase tracking-widest">
                        No se encontraron funcionarios
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {(totalPages > 1 || participants.length > 10) && (
                <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-900/40 rounded-2xl border border-white/5 gap-4">

                    {/* Rows per page selector */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mostrar</span>
                        <div className="relative">
                            <button
                                onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                                className="flex items-center gap-2 bg-slate-800/80 border border-white/10 hover:border-white/20 text-white text-xs font-black rounded-lg px-3 py-1.5 transition-all outline-none"
                            >
                                <span>{itemsPerPage}</span>
                                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isPerPageOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isPerPageOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsPerPageOpen(false)}></div>
                                    <div className="absolute bottom-full left-0 mb-2 w-full min-w-[70px] z-50 bg-slate-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl">
                                        {[10, 20, 50, 100].map(val => (
                                            <button
                                                key={val}
                                                onClick={() => {
                                                    setItemsPerPage(val);
                                                    setIsPerPageOpen(false);
                                                }}
                                                className={`w-full text-center px-2 py-2.5 text-[11px] font-black transition-colors ${itemsPerPage === val ? 'bg-primary-500 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">por pág</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-xl text-gray-500 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Ant</span>
                        </button>

                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="text-primary-400 mx-1">{currentPage}</span> / <span className="text-white mx-1">{totalPages || 1}</span>
                        </div>

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="p-2 rounded-xl text-gray-500 hover:bg-slate-800 hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
                        >
                            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest">Sig</span>
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
