import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";

const LatestProjectCards = ({ project }) => {
  const navigate = useNavigate();
  const [membersInfo, setMembersInfo] = useState([]);
  const [creatorInfo, setCreatorInfo] = useState(null);

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

  return (
    <div
      onClick={() => navigate(`/description/${project._id}`)}
      className="w-64 rounded-lg overflow-hidden shadow-md bg-white cursor-pointer hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative">
        {project.logo ? (
          <img
            src={project.logo}
            alt={`${project?.title || "Project"} Logo`}
            className="h-20 w-full object-cover"
          />
        ) : (
          <div className="h-20 bg-blue-400" />
        )}
        <div className="absolute -bottom-6 left-4">
          <div className="w-12 h-12 bg-pink-400 rounded-full flex items-center justify-center shadow-md">
            {creatorInfo?.profile?.profilePhoto ? (
              <img
                src={creatorInfo.profile.profilePhoto}
                alt="Creator Profile"
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg mb-1 text-black ">
            {project?.title}
          </h2>
          <div className=" right-2 flex items-center space-x-1">
            <div className="flex -space-x-2 overflow-hidden">
              {membersInfo.slice(0, 3).map((member, index) => (
                <img
                  key={index}
                  className="inline-block h-5 w-5 rounded-full "
                  src={member.profile?.profilePhoto || "/api/placeholder/32/32"}
                  alt={`Member ${index + 1}`}
                />
              ))}
            </div>
            {remainingMembers > 0 && (
              <Badge className="bg-white text-black text-xs font-medium ml-2">
                +{remainingMembers}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {project?.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {project?.requirements?.map((req, index) => (
            <Badge
              key={index}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
            >
              {req}
            </Badge>
          )) || (
            <Badge className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              Sample Requirement
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default LatestProjectCards;
