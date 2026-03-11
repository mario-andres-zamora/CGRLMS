import React from 'react';
import Skeleton from '../Skeleton';

export const QuizSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-64" />
                </div>
                <div className="flex gap-8">
                    <div className="space-y-2">
                        <Skeleton className="h-2 w-12 ml-auto" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-2 w-12 ml-auto" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <Skeleton className="h-3 w-full rounded-full" />

            {/* Question Card */}
            <div className="card p-8 md:p-12 space-y-8 relative overflow-hidden">
                <div className="space-y-6">
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="grid gap-4 mt-12">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                    ))}
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="flex items-center justify-between pt-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-14 w-48 rounded-2xl" />
            </div>
        </div>
    );
};
