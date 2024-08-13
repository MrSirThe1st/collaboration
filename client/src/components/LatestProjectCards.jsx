import React from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const LatestProjectCards = ({ project }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/description/${project._id}`)}
      className="p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer"
    >
      <div>
        <h1 className="font-bold text-lg">{project?.title}</h1>
        <p className="text-sm text-gray-600">{project?.description}</p>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Badge className={"text-blue-700 font-bold"} variant="ghost">
          {project?.location}
        </Badge>
        <Badge className={"text-[#F83002] font-bold"} variant="ghost">
          {project?.requirements?.join(", ")}
        </Badge>
        <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
          Max Team Size: {project?.maxTeamSize}
        </Badge>
      </div>
    </div>
  );
};

export default LatestProjectCards;
