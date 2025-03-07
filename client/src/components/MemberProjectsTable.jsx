import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent } from "./ui/popover";
import { Briefcase } from "lucide-react";

const MemberProjectsGrid = ({ projects, user }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
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
            <div className="p-4 relative z-10">
              {project.logo ? (
                <img
                  src={project.logo}
                  alt={`${project.title} logo`}
                  className="w-20 h-20 rounded-full mb-4 mx-auto object-cover"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center rounded-full mb-4 mx-auto bg-primary/20">
                  <Briefcase className="h-10 w-10 text-primary/80" />
                </div>
              )}

              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-600">{member?.role}</p>
                </div>
                <Popover>
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
              <p className="text-sm text-gray-600 line-clamp-3">
                {project.description}
              </p>
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
