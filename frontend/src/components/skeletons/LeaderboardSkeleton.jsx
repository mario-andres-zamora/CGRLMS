import Skeleton from '../Skeleton';

const LeaderboardSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20">
    {/* Header / Hero Section Skeleton */}
    <div className="relative rounded-[3rem] overflow-hidden bg-slate-800/20 border border-white/5 p-10 md:p-16 h-[300px]">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-12 h-full">
        <div className="space-y-6 flex-1 text-center md:text-left">
          <Skeleton className="h-16 w-64" />
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-2/3 max-w-xl" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="w-32 h-32 rounded-[2rem]" />
          <Skeleton className="w-32 h-32 rounded-[2rem]" />
        </div>
      </div>
    </div>

    {/* Controls Skeleton */}
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
      <Skeleton className="h-14 w-full md:w-96 rounded-2xl" />
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <Skeleton className="h-14 w-full md:w-64 rounded-2xl" />
        <Skeleton className="h-14 w-full md:w-80 rounded-2xl" />
      </div>
    </div>

    {/* List Skeleton */}
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="grid grid-cols-12 px-8 py-4">
          <Skeleton className="col-span-1 h-3 w-8" />
          <Skeleton className="col-span-5 h-3 w-32" />
          <Skeleton className="col-span-3 h-3 w-24" />
          <Skeleton className="col-span-3 h-3 w-24 ml-auto" />
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="grid grid-cols-12 items-center px-8 py-5 rounded-3xl border border-white/5 bg-slate-800/20">
            <Skeleton className="col-span-1 h-6 w-6" />
            <div className="col-span-5 flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="col-span-3 h-4 w-24 mx-auto" />
            <Skeleton className="col-span-3 h-6 w-20 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default LeaderboardSkeleton;
