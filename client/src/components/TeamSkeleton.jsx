const TeamSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
    {[...Array(8)].map((_, index) => (
      <div
        key={index}
        className="rounded-xl shadow-lg p-3 sm:p-4 md:p-6 border animate-pulse"
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-3 sm:mb-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full bg-slate-200" />
          </div>
          <div className="h-5 sm:h-6 w-24 sm:w-32 bg-slate-200 rounded mb-1 sm:mb-2" />
          <div className="flex items-center gap-1 sm:gap-2 mt-1">
            <div className="h-3 sm:h-4 w-3 sm:w-4 bg-slate-200 rounded" />
            <div className="h-3 sm:h-4 w-20 sm:w-24 bg-slate-200 rounded" />
          </div>
          <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2 w-full">
            <div className="h-2 sm:h-3 w-full bg-slate-200 rounded" />
            <div className="h-2 sm:h-3 w-3/4 bg-slate-200 rounded" />
          </div>
          <div className="mt-3 sm:mt-4 flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 sm:h-5 w-12 sm:w-16 bg-slate-200 rounded-full"
              />
            ))}
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex justify-center gap-2 sm:gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 sm:h-5 w-4 sm:w-5 bg-slate-200 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default TeamSkeleton;
