import React from "react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { MoreHorizontal } from "lucide-react";

const MemberProjectsGrid = ({ projects, user }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {projects.map((project) => {
        const member = project.members.find(
          (member) => member.user === user._id
        );

        return (
          <div
            key={project._id}
            className="bg-muted/40 rounded-lg shadow-md overflow-hidden relative cursor-pointer"
            onClick={() => navigate(`/admin/projects/${project._id}/page`)}
          >
            {/* Subtle background line */}
            <div className="absolute top-1/4 left-0 right-0 h-0.5 bg-white z-0"></div>

            <div className="p-4 relative z-10">
              {/* Circular pink placeholder image */}
              <div className="w-20 h-20 bg-pink-500 rounded-full mb-4 mx-auto "></div>

              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    {project?.group?.name}
                  </p>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600">Role: {member?.role}</p>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() =>
                        navigate(`/admin/projects/${project._id}/page`)
                      }
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <span>View</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-sm text-gray-600">{project.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                {project?.createdAt.split("T")[0]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MemberProjectsGrid;
