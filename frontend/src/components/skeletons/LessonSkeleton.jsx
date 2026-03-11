import React from 'react';
import Skeleton from '../Skeleton';

export const LessonSkeleton = () => {
    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 min-h-screen animate-fade-in pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
                {/* Sidebar Menu */}
                <aside className="lg:col-span-3 xl:col-span-3">
                    <div className="lg:sticky lg:top-20 space-y-4">
                        <div className="card bg-slate-800/20 border-white/5 p-4 mb-3">
                            <Skeleton className="h-3 w-24 mb-4" />
                            <Skeleton className="h-6 w-full mb-4" />
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-1 flex-1" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                        </div>
                        <div className="card bg-slate-900/40 p-2 border-white/5 shadow-2xl border-dashed">
                            <div className="p-2 border-b border-white/5 mb-2">
                                <Skeleton className="h-2 w-20 mx-auto" />
                            </div>
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="flex gap-3 p-2">
                                        <Skeleton className="h-7 w-7 rounded-lg" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-2 w-12" />
                                            <Skeleton className="h-3 w-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="lg:col-span-9 xl:col-span-9 space-y-6">
                    <div className="hidden lg:flex items-center justify-between py-4 border-b border-white/5">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-2 w-20" />
                                <Skeleton className="h-8 w-64" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Skeleton className="h-48 w-full rounded-2xl" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-64 w-full rounded-2xl" />
                    </div>
                </main>
            </div>
        </div>
    );
};
