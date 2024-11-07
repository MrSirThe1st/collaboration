import React from "react";
import LatestProjectCards from "./LatestProjectCards";

const LatestProjects = ({ projects }) => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {!projects || projects.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-8">
            No projects found for the selected criteria
          </div>
        ) : (
          projects.map((project) => (
            <LatestProjectCards key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default LatestProjects;