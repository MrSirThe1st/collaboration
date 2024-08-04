import React from "react";
import LatestProjectCards from "./LatestProjectCards";
import { useSelector } from "react-redux";



const LatestProjects = () => {
  const { allProjects } = useSelector((store) => store.project);

  return (
    <div className="max-w-7xl mx-auto my-20">
      <h1 className="text-4xl font-bold">
        <span className="text-[#6A38C2]">Latest & Top </span> project Openings
      </h1>
      <div className="grid grid-cols-3 gap-4 my-5">
        {allProjects.length <= 0 ? (
          <span>No Projects Available Yet</span>
        ) : (
          allProjects
            ?.slice(0, 6)
            .map((project) => <LatestProjectCards key={project._id} project={project} />)
        )}
      </div>
    </div>
  );
};

export default LatestProjects;
