import React from 'react';
import Skeleton from '../Skeleton';

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
    return (
        <div className="card overflow-hidden !p-0 border-white/5 animate-fade-in">
            <div className="bg-white/5 border-b border-white/5 px-6 py-4 flex justify-between">
                {[...Array(cols)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-20" />
                ))}
            </div>
            <div className="divide-y divide-white/5">
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="px-6 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-2 w-24" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <Skeleton className="h-3 w-full max-w-[150px]" />
                        </div>
                        <div className="flex-1 flex justify-center">
                            <Skeleton className="h-4 w-12 rounded-full" />
                        </div>
                        <div className="flex-1 flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
