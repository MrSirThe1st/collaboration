const ProjectSkeleton = () => (
  <div className="w-full rounded-lg overflow-hidden shadow-md bg-white animate-pulse">
    <div className="h-16 sm:h-20 bg-gray-300" />
    <div className="p-3 sm:p-4 pt-6 sm:pt-8">
      <div className="h-5 sm:h-6 bg-gray-300 rounded w-3/4 mb-1 sm:mb-2" />
      <div className="space-y-1 sm:space-y-2">
        <div className="h-3 sm:h-4 bg-gray-300 rounded w-full" />
        <div className="h-3 sm:h-4 bg-gray-300 rounded w-5/6" />
      </div>
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-5 sm:h-6 bg-gray-300 rounded w-12 sm:w-16"
          />
        ))}
      </div>
    </div>
  </div>
);

export default ProjectSkeleton;
