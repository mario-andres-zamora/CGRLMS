import React from 'react';
import { Award, FileText, ChevronRight, Shield, Lock } from 'lucide-react';

export default function CertificatesAndBadges({ certificates, badges, stats, onCertClick }) {
    return (
        <div className="space-y-10">
            {/* Certificates */}
            <div className="space-y-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight text-left">Certificaciones</h3>
                {certificates.length > 0 ? (
                    <div className="space-y-3">
                        {certificates.map((cert) => (
                            <div
                                key={cert.id}
                                className="p-4 rounded-xl bg-slate-900 border border-white/5 hover:border-secondary-500/30 transition-all cursor-pointer group text-left"
                                onClick={() => onCertClick(cert)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-secondary-500/20 rounded-lg text-secondary-500">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-bold text-xs uppercase tracking-tight">{cert.module_title}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{new Date(cert.issued_at).toLocaleDateString()}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-secondary-500" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 rounded-3xl bg-slate-800/10 border border-dashed border-white/5 text-center">
                        <Award className="w-10 h-10 text-gray-700 mx-auto mb-3 opacity-20" />
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">No has obtenido certificados todavia</p>
                    </div>
                )}
            </div>

            {/* Insignias / Badges */}
            <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4 text-left">
                    <div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Insignias Obtenidas</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Tu colección de logros y reconocimientos</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-1 py-1 bg-primary-500/10 border border-primary-500/20 rounded-full text-[9px] font-black text-primary-400 uppercase tracking-widest">
                            {badges?.length || 0} / 24
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                    {Array.isArray(badges) && badges.map((badge, i) => (
                        <div key={badge.id || i} className="group relative flex flex-col gap-3">
                            <div className="aspect-square rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center relative cursor-help shadow-xl transition-all duration-500 hover:border-primary-500/40 hover:shadow-primary-500/10 hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src={`/images/badges/${badge.image_url || 'bienvenida-seguridad.svg'}`}
                                    alt={badge.name}
                                    className="w-full h-full object-contain p-3 transition-transform duration-700 group-hover:scale-110 drop-shadow-[0_0_15px_rgba(56,74,153,0.3)]"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/shield.svg';
                                    }}
                                />
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 mb-3 px-4 py-3 bg-slate-900/95 backdrop-blur-xl text-white rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 w-56 z-50 pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] scale-90 group-hover:scale-100 origin-bottom">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                                        <div className="w-2 h-2 rounded-full bg-secondary-500 animate-pulse"></div>
                                        <p className="text-[10px] font-black text-secondary-500 uppercase tracking-[0.2em]">{badge.name}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">¿Por qué la ganaste?</p>
                                        <p className="text-[10px] text-gray-300 font-medium leading-relaxed italic">"{badge.description}"</p>
                                    </div>
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95"></div>
                            </div>

                            <div className="text-center space-y-1">
                                <p className="text-[10px] font-black text-white uppercase leading-[1.1] px-1 group-hover:text-primary-400 transition-colors">
                                    {badge.name}
                                </p>
                                <p className="text-[8px] text-primary-500/60 font-black uppercase tracking-tighter">
                                    {new Date(badge.earned_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Placeholder for locked badges */}
                    {[...Array(Math.max(0, 8 - (badges?.length || 0)))].map((_, i) => (
                        <div key={`locked-${i}`} className="flex flex-col gap-3 opacity-20 grayscale transition-opacity hover:opacity-30">
                            <div className="aspect-square rounded-2xl bg-slate-950/40 border border-white/5 flex items-center justify-center relative">
                                <Shield className="w-8 h-8 text-slate-800" />
                                <Lock className="w-4 h-4 absolute top-2 right-2 text-slate-800" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Bloqueada</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
