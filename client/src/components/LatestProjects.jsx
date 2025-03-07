import LatestProjectCards from "./LatestProjectCards";
import ProjectSkeleton from "./ProjectSkeleton";

const LatestProjects = ({ projects, isLoading }) => {
  if (isLoading) {
    return (
      <div className="transition-opacity duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(null)
            .map((_, index) => (
              <ProjectSkeleton key={index} />
            ))}
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="max-w-7xl mx-auto ">
        <div className="text-center text-gray-500 py-8">
          No projects found for the selected criteria
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {projects.map((project) => (
        <LatestProjectCards key={project._id} project={project} />
      ))}
    </div>
  );
};

export default LatestProjects;
