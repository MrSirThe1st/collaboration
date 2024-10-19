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
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
} from "lucide-react";

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
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/request/${projectId}`,
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
    <div className="max-w-7xl mx-auto my-10 px-4">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-3xl font-bold">
              {singleProject?.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="secondary" className="text-blue-700 font-bold">
                {singleProject?.description} Positions
              </Badge>
              <Badge variant="secondary" className="text-[#F83002] font-bold">
                {singleProject?.location}
              </Badge>
              <Badge variant="secondary" className="text-[#7209b7] font-bold">
                {singleProject?.requirements} LPA
              </Badge>
            </div>
          </div>
          {isCreator ? (
            <Button
              onClick={viewProjectHandler}
              className="rounded-lg bg-[#4CAF50] hover:bg-[#45a049]"
            >
              View Project
            </Button>
          ) : (
            <Button
              onClick={isRequested ? null : requestProjectHandler}
              disabled={isRequested}
              className={`rounded-lg ${
                isRequested
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#7209b7] hover:bg-[#5f32ad]"
              }`}
            >
              {isRequested ? "Already Requested" : "Request Now"}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <BriefcaseIcon className="mr-2" />
              <span className="font-medium">Role:</span>
              <span className="ml-2">{singleProject?.title}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="mr-2" />
              <span className="font-medium">Location:</span>
              <span className="ml-2">{singleProject?.location}</span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="mr-2" />
              <span className="font-medium">Total Requesters:</span>
              <span className="ml-2">{singleProject?.requests?.length}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="mr-2" />
              <span className="font-medium">Posted Date:</span>
              <span className="ml-2">
                {new Date(singleProject?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-medium">Description:</h3>
            <p className="mt-2 text-gray-700">{singleProject?.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Team Members</CardTitle>
          <p className="text-sm text-gray-600">
            Number of Members: {singleProject?.members?.length || 0}
          </p>
        </CardHeader>
        <CardContent>
          {membersInfo.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {membersInfo.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={
                        member.profile?.profilePhoto || "/default-avatar.png"
                      }
                      alt={member.title || "Member"}
                    />
                    <AvatarFallback>
                      {member.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h3 className="font-semibold">{member.username}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              No members yet. Be the first to join!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDescription;
