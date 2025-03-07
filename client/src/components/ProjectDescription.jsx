import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  PROJECT_API_END_POINT,
} from "@/utils/constant";
import { setSingleProject } from "@/redux/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Loader } from "lucide-react";
import UserAvatar from "./customUI/UserAvatar";
import Flag from "react-world-flags";

const ProjectDescription = () => {
  const { singleProject } = useSelector((store) => store.project);
  const { user } = useSelector((store) => store.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const navigate = useNavigate();

  const isInitiallyRequested =
    singleProject?.requests?.some(
      (request) => request.requester === user?._id
    ) || false;

  const [isRequested, setIsRequested] = useState(isInitiallyRequested);
  const [isCreator, setIsCreator] = useState(false);
  const [membersInfo, setMembersInfo] = useState([]);

  const params = useParams();
  const projectId = params.id;
  const dispatch = useDispatch();

  const requestProjectHandler = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/request/${projectId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsRequested(true);
        const updatedSingleProject = {
          ...singleProject,
          requests: [...singleProject.requests, { requester: user?._id }],
        };
        dispatch(setSingleProject(updatedSingleProject));
        toast.success(res.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const fetchMembersInfo = async () => {
    setIsLoading(true);
    setIsMembersLoading(true);
    if (singleProject && singleProject.members) {
      try {
        const membersData = await Promise.all(
          singleProject.members.map(async (member) => {
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
      } finally {
        setIsLoading(false);
        setIsMembersLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchSingleProject = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${PROJECT_API_END_POINT}/get/${projectId}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setSingleProject(res.data.project));
          setIsRequested(
            res.data.project.requests.some(
              (request) => request.requester === user?._id
            )
          );
          setIsCreator(res.data.project.created_by === user?._id);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSingleProject();
  }, [projectId, dispatch, user?._id]);

  useEffect(() => {
    fetchMembersInfo();
  }, [singleProject]);

  const viewProjectHandler = () => {
    navigate(`/admin/projects/${projectId}/page`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto my-4 sm:my-10 px-2 sm:px-4 space-y-4 sm:space-y-8">
      {/* Hero Section - Responsive adjustments */}
      <div className="relative rounded-xl overflow-hidden shadow-xl">
        <div className="absolute inset-0">
          {singleProject?.cover ? (
            <img
              src={singleProject.cover}
              alt={singleProject.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-700 to-indigo-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90" />
        </div>

        {/* Content - Responsive layout */}
        <div className="relative z-10 p-4 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 sm:gap-6">
            {/* Project Logo - Responsive sizing */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                {singleProject?.logo ? (
                  <img
                    src={singleProject.logo}
                    alt={singleProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl font-bold">
                      {singleProject?.title?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Info - Responsive text */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">
                {singleProject?.title}
              </h1>
            </div>

            {/* Actions - Responsive sizing */}
            <div className="flex-shrink-0">
              {isCreator ? (
                <Button
                  onClick={viewProjectHandler}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base"
                >
                  Manage Project
                </Button>
              ) : (
                <Button
                  onClick={isRequested ? null : requestProjectHandler}
                  disabled={isRequested}
                  className={`text-sm sm:text-base ${
                    isRequested
                      ? "bg-white"
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {isRequested ? "Request Sent" : "Request to join Project"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview - Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
        {/* Main Info */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className=" sm:text-lg">Project Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="prose max-w-none">
                <p className="text-sm sm:text-sm text-white">
                  {singleProject?.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Info */}
        <div className="space-y-4 sm:space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-lg">
                Required Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {singleProject?.skills?.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs sm:text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Members - Responsive grid */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="sm:text-lg">Project members</CardTitle>
            <Badge variant="outline" className="text-sm sm:text-lg">
              {membersInfo.length} Member(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-3">
          {membersInfo.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {membersInfo.map((member, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-2 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  <div className="mb-2">
                    <UserAvatar
                      user={member}
                      size="sm"
                      showStatus={true}
                      className="ring-2 ring-primary/20"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-sm">{member.username}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {member.role}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {member.profession}
                    </p>
                    {member.profile?.country && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <Flag
                          code={member.profile.country.code}
                          className="h-3 w-4 object-cover"
                        />
                        <span className="text-xs text-muted-foreground">
                          {member.profile.country.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium">No team members yet</p>
              <p className="text-sm">Be the first to join this project!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDescription;
