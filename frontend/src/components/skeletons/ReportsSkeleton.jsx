import React from 'react';
import Skeleton from '../Skeleton';

export const ReportsSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <Skeleton className="h-14 w-40 rounded-2xl" />
                    <Skeleton className="h-14 w-40 rounded-2xl" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="card p-8 bg-slate-900/40">
                        <div className="flex justify-between mb-6">
                            <Skeleton className="h-12 w-12 rounded-2xl" />
                            <Skeleton className="h-4 w-12 rounded-lg" />
                        </div>
                        <Skeleton className="h-10 w-24 mb-2" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                    <div className="card p-8 space-y-8">
                        <div className="flex justify-between items-baseline">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-10 w-48 rounded-xl" />
                        </div>
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                    <div className="card !p-0">
                        <div className="p-8 border-b border-white/5 flex justify-between">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-10 w-48 rounded-xl" />
                        </div>
                        <div className="p-8 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="space-y-10">
                    <div className="card p-8 space-y-6">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-64 w-64 rounded-full mx-auto" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                    <div className="card p-8 space-y-6 bg-red-500/5">
                        <Skeleton className="h-6 w-48" />
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                            ))}
                        </div>
                        <Skeleton className="h-14 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
};
