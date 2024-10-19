import React from "react";
import LatestProjectCards from "./LatestProjectCards";
import { useSelector } from "react-redux";


const LatestProjects = () => {
  const { allProjects } = useSelector((store) => store.project);
  

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="grid grid-cols-3 gap-4 my-5">
        {!allProjects || allProjects.length <= 0 ? (
          <span>No Projects Available Yet</span>
        ) : (
          allProjects.map((project) => (
            <LatestProjectCards key={project._id} project={project} />
          ))
        )}
      </div>
    </div>
  );
};

export default LatestProjects;
