import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSingleProject } from "@/redux/projectSlice";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TagIcon,
  BookIcon,
  FlagIcon,
  ClockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.singleProject);
  const user = useSelector((state) => state.auth.user);
  const [membersInfo, setMembersInfo] = useState([]);

  const isProjectOwner = project?.created_by === user._id;

  const fetchProject = async () => {
    try {
      const response = await axios.get(`${PROJECT_API_END_POINT}/get/${id}`, {
        withCredentials: true,
      });
      dispatch(setSingleProject(response.data.project));
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  useEffect(() => {
    fetchProject();
    const pollInterval = setInterval(fetchProject, 30000);
    return () => clearInterval(pollInterval);
  }, [id, dispatch]);

  useEffect(() => {
    if (project && project.members) {
      const fetchMembersInfo = async () => {
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
      };
      fetchMembersInfo();
    }
  }, [project]);

  if (!project)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  const handleMemberClick = (member) => {
    navigate(`/messages/${member._id}`, { state: { member } });
  };

  const calculateProgress = () => {
    const totalDuration =
      new Date(project.endDate) - new Date(project.startDate);
    const elapsed = new Date() - new Date(project.startDate);
    return Math.min(Math.round((elapsed / totalDuration) * 100), 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={project.logo} alt={project.title} />
              <AvatarFallback>
                {project.title.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-bold">
                {project.title}
              </CardTitle>
              <Badge
                variant={
                  project.status === "In Progress" ? "default" : "secondary"
                }
              >
                {project.status}
              </Badge>
            </div>
          </div>
          {isProjectOwner && (
            <Button
              onClick={() => navigate(`/admin/projects/${project._id}/edit`)}
            >
              Edit Project
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center">
              <CalendarIcon className="mr-2" />
              <span>
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="mr-2" />
              <span>Location: {project.location}</span>
            </div>
            <div className="flex items-center">
              <UsersIcon className="mr-2" />
              <span>Max Team Size: {project.maxTeamSize}</span>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Requirements:</h3>
            <div className="flex flex-wrap gap-2">
              {project.requirements.map((req, index) => (
                <Badge key={index} variant="secondary">
                  {req}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Skills:</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  <TagIcon className="w-4 h-4 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Timeline:</h3>
            <div className="flex items-center justify-between">
              <span>
                Start: {new Date(project.startDate).toLocaleDateString()}
              </span>
              <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
            </div>
            <Progress value={calculateProgress()} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="team" className="mb-8">
        <TabsList>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              {membersInfo.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {membersInfo.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleMemberClick(member)}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={member.profile?.profilePhoto}
                          alt={member.username}
                        />
                        <AvatarFallback>
                          {member.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <p className="font-semibold">{member.username}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No team members yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="milestones">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.milestones.length > 0 ? (
                <ul className="space-y-4">
                  {project.milestones.map((milestone, index) => (
                    <li key={index} className="flex items-center">
                      <FlagIcon className="mr-2" />
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No milestones set yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.resources.length > 0 ? (
                <ul className="space-y-4">
                  {project.resources.map((resource, index) => (
                    <li key={index} className="flex items-center">
                      <BookIcon className="mr-2" />
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {resource.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No resources added yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Open Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.openPositions.length > 0 ? (
            <ul className="space-y-4">
              {project.openPositions.map((position, index) => (
                <li key={index} className="flex items-center">
                  <ClockIcon className="mr-2" />
                  <span>{position}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No open positions at the moment.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectPage;
