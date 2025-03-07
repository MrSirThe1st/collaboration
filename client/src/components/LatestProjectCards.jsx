import { useEffect, useState, useMemo } from "react";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import UserAvatar from "./customUI/UserAvatar";
import Flag from "react-world-flags";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const LatestProjectCards = ({ project }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [membersInfo, setMembersInfo] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState(null);
  const [showAllRequirements, setShowAllRequirements] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedRequirements = useMemo(() => {
    return (
      project?.requirements?.map((req) => req.replace(/["\[\]]/g, "").trim()) ||
      []
    );
  }, [project?.requirements]);

  const displayedRequirements = useMemo(() => {
    if (showAllRequirements) {
      return formattedRequirements;
    }
    return formattedRequirements.slice(0, 3);
  }, [formattedRequirements, showAllRequirements]);

  const fetchMembersInfo = async () => {
    if (project && project.members) {
      try {
        const membersData = await Promise.all(
          project.members.map(async (member) => {
            const response = await axios.get(
              `${PROJECT_API_END_POINT}/users/${member.user}`,
              { withCredentials: true }
            );
            return {
              ...response.data.user,
              role: member.role,
            };
          })
        );
        setMembersInfo(membersData);
      } catch (error) {
        console.error("Error fetching member information:", error);
      }
    }
  };

  const fetchCreatorInfo = async () => {
    if (project && project.created_by) {
      try {
        const response = await axios.get(
          `${PROJECT_API_END_POINT}/users/${project.created_by}`,
          { withCredentials: true }
        );
        setCreatorInfo(response.data.user);
      } catch (error) {
        console.error("Error fetching creator information:", error);
      }
    }
  };

  useEffect(() => {
    fetchMembersInfo();
    fetchCreatorInfo();
  }, [project]);

  const remainingMembers = membersInfo.length - 3;

  const CoverPlaceholder = () => (
    <div className="h-full w-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );

  // const LogoPlaceholder = () => (
  //   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-md">
  //     <svg
  //       className="w-6 h-6 text-gray-400"
  //       fill="none"
  //       viewBox="0 0 24 24"
  //       stroke="currentColor"
  //     >
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         strokeWidth={1.5}
  //         d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
  //       />
  //     </svg>
  //   </div>
  // );

  return (
    <div
      onClick={() => navigate(`/description/${project._id}`)}
      className={cn(
        "w-64 rounded-lg overflow-hidden shadow-md bg-white cursor-pointer hover:shadow-xl transition-all duration-300",
        isExpanded ? "h-auto" : "h-[245px]"
      )}
    >
      <div className="relative h-20">
        {project.logo ? (
          <img
            src={project.logo}
            alt={`${project?.title || "Project"} Logo`}
            className="h-full w-full object-cover"
          />
        ) : (
          <CoverPlaceholder />
        )}

        {!project.countryRestriction.isGlobal && (
          <div className="absolute top-2 right-2 z-10">
            {" "}
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-1  rounded-full shadow-sm border border-gray-100">
              <Flag
                code={project.countryRestriction.country.code}
                className="h-3 w-4 object-cover rounded-sm"
              />
              <span className="text-[10px] font-medium text-gray-600">
                {project.countryRestriction.country.name} only
              </span>
            </div>
            {user?.profile?.country?.code !==
              project.countryRestriction.country.code && (
              <Badge
                variant="destructive"
                className="absolute top-full right-0 mt-1 text-[8px] whitespace-nowrap px-1 py-0.5"
              >
                Not available in your region
              </Badge>
            )}
          </div>
        )}

        {/* <div className="absolute -bottom-6 left-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-md">
            {project.logo ? (
              <img
                src={project.logo}
                alt="Creator Profile"
                className="h-12 w-12 rounded-full object-cover shadow-md"
              />
            ) : (
              <LogoPlaceholder />
            )}
          </div>
        </div> */}
      </div>

      {/* Card Content */}
      <div className="p-4 pt-8">
        {/* Title and Members Section - Fixed height */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-lg truncate max-w-[70%] text-black">
            {project?.title}
          </h2>

          <div className="flex items-center space-x-1">
            <div className="flex -space-x-2 overflow-hidden">
              {membersInfo.slice(0, 3).map((member, index) => (
                <div
                  key={index}
                  className="inline-block ring-2 ring-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <UserAvatar user={member} size="sm" className="h-5 w-5" />
                </div>
              ))}
            </div>
            {remainingMembers > 0 && (
              <Badge className="bg-white text-black text-xs font-medium ml-2">
                +{remainingMembers}
              </Badge>
            )}
          </div>
        </div>

        {/* Description - Fixed height with truncation */}
        <p className="text-xs text-gray-400 mb-2 line-clamp-2">
          {project?.description}
        </p>

        {/* Requirements Section */}
        <div className="flex flex-wrap gap-1">
          {(isExpanded
            ? project?.requirements
            : project?.requirements?.slice(0, 3)
          )?.map((req, index) => (
            <Badge
              key={index}
              className="bg-gray-100 text-gray-600 text-xs h-6 px-2 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]"
            >
              {req}
            </Badge>
          ))}

          {project?.requirements?.length > 3 && (
            <Button
              variant="secondary"
              size="sm"
              className="h-6 px-2  hover:bg-primary/20 text-primary font-medium text-xs ml-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "Show Less" : `+${project.requirements.length - 3}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestProjectCards;
