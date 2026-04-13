import { LessonSkeleton } from '../components/skeletons/LessonSkeleton';
import { useLessonView } from '../hooks/useLessonView';
import LessonSidebar from '../components/lessons/LessonSidebar';
import LessonHeader from '../components/lessons/LessonHeader';
import LessonContentItem from '../components/lessons/LessonContentItem';
import LessonCompletion from '../components/lessons/LessonCompletion';
import LessonNavigation from '../components/lessons/LessonNavigation';
import { Zap, FileText } from 'lucide-react';

export default function LessonView() {
    const {
        id,
        lesson,
        contents,
        progress,
        moduleLessons,
        navigation,
        loading,
        completing,
        watchedVideos,
        visitedLinks,
        ytApiLoaded,
        uploadingAssignment,
        completionError,
        user,
        viewAsStudent,
        navigate,
        handleComplete,
        markVideoAsWatched,
        markLinkAsVisited,
        handleResourceDownload,
        handleAssignmentUpload
    } = useLessonView();

    if (loading) {
        return <LessonSkeleton />;
    }

    if (!lesson) return null;

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-0 md:pt-2 pb-20 min-h-screen animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
                <LessonSidebar
                    lesson={lesson}
                    moduleLessons={moduleLessons}
                    currentLessonId={id}
                    user={user}
                    viewAsStudent={viewAsStudent}
                />

                <main className="lg:col-span-9 xl:col-span-9 space-y-4 animate-fade-in-up">
                    <LessonHeader lesson={lesson} contentsCount={contents.length} />

                    {!!lesson.is_optional && (
                        <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex gap-4 items-center animate-fade-in mb-6 shadow-lg shadow-indigo-500/5">
                            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                                <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
                            </div>
                            <div>
                                <h4 className="text-indigo-400 font-black text-xs uppercase tracking-widest mb-1">Lección Opcional</h4>
                                <p className="text-indigo-300/70 text-sm font-medium">
                                    Esta actividad es complementaria. Puede completarla para ganar puntos extra, pero <span className="text-indigo-300 font-bold underline decoration-indigo-500/40">no es obligatoria</span> para finalizar el módulo o recibir su certificado.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {contents.length > 0 ? (
                            contents.map((item, index) => (
                                <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                    <LessonContentItem
                                        item={item}
                                        ytApiLoaded={ytApiLoaded}
                                        watchedVideos={watchedVideos}
                                        visitedLinks={visitedLinks}
                                        markVideoAsWatched={markVideoAsWatched}
                                        markLinkAsVisited={markLinkAsVisited}
                                        handleResourceDownload={handleResourceDownload}
                                        handleAssignmentUpload={handleAssignmentUpload}
                                        uploadingAssignment={uploadingAssignment}
                                        navigate={navigate}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-slate-800/30 rounded-3xl border border-white/5 border-dashed">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                                    <FileText className="w-8 h-8" />
                                </div>
                                <h3 className="text-white font-bold text-lg mb-2">Sin contenido aún</h3>
                                <p className="text-gray-500 text-sm max-w-md mx-auto">Esta lección no tiene material agregado aún.</p>
                            </div>
                        )}
                    </div>

                    <LessonCompletion
                        progress={progress}
                        lesson={lesson}
                        contents={contents}
                        watchedVideos={watchedVideos}
                        visitedLinks={visitedLinks}
                        completing={completing}
                        handleComplete={handleComplete}
                        completionError={completionError}
                    />

                    <LessonNavigation navigation={navigation} />
                </main>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
