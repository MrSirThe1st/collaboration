import React, { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

const ProjectDescription = () => {
  const { singleProject } = useSelector((store) => store.project);
  const { user } = useSelector((store) => store.auth);
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
    try {
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/request/${projectId}`,
        {}, // Empty object as body if no data needed
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
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const fetchMembersInfo = async () => {
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
      }
    }
  };

  useEffect(() => {
    const fetchSingleProject = async () => {
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

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 space-y-8 ">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden shadow-xl">
        {/* Background Image/Logo with Overlay */}
        <div className="absolute inset-0">
          {singleProject?.logo ? (
            <img
              src={singleProject.logo}
              alt={singleProject.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-700 to-indigo-800" />
          )}
          {/* Gradient overlay - always present */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-indigo-900/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-8 text-white">
          <div className="flex justify-between items-start gap-6">
            {/* Project Logo in Circle */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                {singleProject?.logo ? (
                  <img
                    src={singleProject.logo}
                    alt={singleProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center">
                    <span className="text-2xl font-bold">
                      {singleProject?.title?.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">
                {singleProject?.title}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex-shrink-0">
              {isCreator ? (
                <Button
                  onClick={viewProjectHandler}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  Manage Project
                </Button>
              ) : (
                <Button
                  onClick={isRequested ? null : requestProjectHandler}
                  disabled={isRequested}
                  className={`${
                    isRequested
                      ? "bg-white"
                      : "bg-white text-purple-700 hover:bg-gray-100"
                  }`}
                >
                  {isRequested ? "Request Sent" : "Join Project"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl ">Project Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 ">
              <div className="prose max-w-none">
                <p className="text-white ">{singleProject?.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Info */}
        <div className="space-y-8">
          {/* Required Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Required Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {singleProject?.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Meet the team</CardTitle>
            <Badge variant="outline" className="text-lg">
              {membersInfo.length} Member(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {membersInfo.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {membersInfo.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center p-4  rounded-lg  transition-colors"
                >
                  <Avatar className="h-14 w-14 border-2 border-purple-200">
                    <AvatarImage
                      src={
                        member.profile?.profilePhoto || "/default-avatar.png"
                      }
                      alt={member.username}
                    />
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      {member.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">
                      {member.username}
                    </h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {member.profession}
                    </Badge>
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
