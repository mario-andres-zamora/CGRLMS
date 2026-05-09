import React from 'react';
import { ArrowLeft, Sun, Moon, Monitor, Palette } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useThemeStore } from '../store/themeStore';
import ProfileSkeleton from '../components/skeletons/ProfileSkeleton';
import ProfileHero from '../components/profile/ProfileHero';
import ProfileStats from '../components/profile/ProfileStats';
import ActivityHistory from '../components/profile/ActivityHistory';
import CertificatesAndBadges from '../components/profile/CertificatesAndBadges';

export default function Profile() {
    const {
        profileData,
        loading,
        currentPage,
        setCurrentPage,
        activitiesPerPage,
        userId,
        navigate
    } = useProfile();

    const { theme, setTheme } = useThemeStore();

    if (loading) {
        return <ProfileSkeleton />;
    }

    if (!profileData) return null;

    const { user, stats, progress, activities, certificates } = profileData;

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-20">
            {/* Admin Back Button */}
            {userId && (
                <button
                    onClick={() => navigate('/admin/users')}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-2"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a Gestión de Usuarios
                </button>
            )}

            <ProfileHero user={user} stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <ProfileStats 
                        stats={stats} 
                        progress={progress} 
                        department={user.department} 
                    />

                    <ActivityHistory 
                        activities={activities}
                        currentPage={currentPage}
                        activitiesPerPage={activitiesPerPage}
                        onPageChange={setCurrentPage}
                        onActivityClick={(activity) => {
                            const refId = activity.reference_id;
                            if (!refId) return;
                            if (activity.type === 'lesson_completed') navigate(`/lessons/${refId}`);
                            if (activity.type === 'quiz_passed') navigate(`/quizzes/${refId}`);
                            if (activity.type === 'module_completed') navigate(`/modules/${refId}`);
                        }}
                    />
                </div>

                <div className="lg:col-span-1 space-y-10">
                    <CertificatesAndBadges 
                        certificates={certificates}
                        badges={stats.badges}
                        stats={stats}
                        onCertClick={(cert) => navigate(`/certificates/module/${cert.module_id}`, { state: { from: '/profile' } })}
                    />

                    {/* Theme Settings Card - Mover aquí debajo de insignias */}
                    {user.allowThemeChange !== false && (
                        <div className="bg-[var(--card-bg)] backdrop-blur-md border border-white/5 rounded-3xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary-500/10 rounded-xl">
                                    <Palette className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-[var(--text-color)] uppercase tracking-widest leading-tight">Personalización</h3>
                                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Elige el tema visual</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setTheme('dark')}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                                        theme === 'dark' 
                                            ? 'bg-primary-500/20 border-primary-500 text-white shadow-lg shadow-primary-500/10' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-primary-500 text-white' : 'bg-slate-800 text-gray-600'}`}>
                                        <Moon className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Modo Oscuro</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setTheme('light')}
                                    className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                                        theme === 'light' 
                                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-600 shadow-lg shadow-blue-500/5' 
                                            : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`p-2 rounded-lg ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-gray-600'}`}>
                                        <Sun className="w-4 h-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Modo Claro</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
