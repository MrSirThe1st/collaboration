import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setSingleProject } from "@/redux/projectSlice";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import CalendarView from "../ProjectMessages/components/CalendarView";
import MembersList from "../ProjectMessages/MembersList";
import MessageArea from "../ProjectMessages/MessagesArea";
import FilesView from "../ProjectMessages/components/FilesView";
import MilestonesView from "../ProjectMessages/components/MilestonesView";
import TasksView from "../ProjectMessages/components/TasksView";
import ChannelsList from "../ProjectMessages/ChannelsList";
import ProjectInfo from "../ProjectMessages/ProjectInfo";
import ProjectHeader from "../ProjectMessages/ProjectHeader";
import Layout from "../ProjectMessages/Layout";
import Group from "./group";
import {
  Hash,
  Users,
  Settings,
  Plus,
  ChevronDown,
  Lock,
  Bell,
  MessageSquare,
  ListTodo,
  Milestone,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const ProjectPage = () => {
  // Existing state
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.singleProject);
  const user = useSelector((state) => state.auth.user);
  const [membersInfo, setMembersInfo] = useState([]);

  // New state for project management features
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([
    { id: "general", name: "General", type: "public" },
    { id: "announcements", name: "Announcements", type: "restricted" },
  ]);
  const [roleChannels, setRoleChannels] = useState([]);
  const [activeView, setActiveView] = useState("chat"); // chat, tasks, files, etc
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Project Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 border-r">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg truncate">{project?.title}</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Project Settings</DropdownMenuItem>
                <DropdownMenuItem>Invite Members</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Leave Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{project?.status}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {membersInfo.length}
            </Badge>
          </div>
        </div>

        <ScrollArea className="flex-1">
          {/* Channels Section */}
          <div className="p-2">
            <div className="flex items-center justify-between p-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Channels
              </h3>
              {isProjectOwner && (
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="space-y-[2px]">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 rounded-md",
                    "hover:bg-accent text-sm",
                    selectedChannel?.id === channel.id && "bg-accent"
                  )}
                  onClick={() => setSelectedChannel(channel)}
                >
                  <Hash className="h-4 w-4" />
                  <span className="flex-1 text-left">{channel.name}</span>
                  {channel.type === "restricted" && (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Role-based Channels */}
          {roleChannels.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between p-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Role Channels
                </h3>
              </div>
              <div className="space-y-[2px]">
                {roleChannels.map((channel) => (
                  <button
                    key={channel.id}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-md",
                      "hover:bg-accent text-sm",
                      selectedChannel?.id === channel.id && "bg-accent"
                    )}
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <Users className="h-4 w-4" />
                    <span className="flex-1 text-left">{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-2" />

          {/* Quick Access */}
          <div className="p-2">
            <h3 className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
              Quick Access
            </h3>
            <div className="space-y-[2px]">
              <button
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-md",
                  "hover:bg-accent text-sm",
                  activeView === "tasks" && "bg-accent"
                )}
                onClick={() => setActiveView("tasks")}
              >
                <ListTodo className="h-4 w-4" />
                <span>Tasks</span>
              </button>
              <button
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-md",
                  "hover:bg-accent text-sm",
                  activeView === "milestones" && "bg-accent"
                )}
                onClick={() => setActiveView("milestones")}
              >
                <Milestone className="h-4 w-4" />
                <span>Milestones</span>
              </button>
              <button
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-md",
                  "hover:bg-accent text-sm",
                  activeView === "files" && "bg-accent"
                )}
                onClick={() => setActiveView("files")}
              >
                <FileText className="h-4 w-4" />
                <span>Files</span>
              </button>
              <button
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-md",
                  "hover:bg-accent text-sm",
                  activeView === "calendar" && "bg-accent"
                )}
                onClick={() => setActiveView("calendar")}
              >
                <Calendar className="h-4 w-4" />
                <span>Calendar</span>
              </button>
            </div>
          </div>
        </ScrollArea>

        {/* User Section */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.profile?.profilePhoto} />
              <AvatarFallback>
                {user?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role || "Member"}
              </p>
            </div>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Channel/View Header */}
        <header className="h-14 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {selectedChannel ? (
              <>
                <Hash className="h-4 w-4" />
                <h3 className="font-semibold">{selectedChannel.name}</h3>
              </>
            ) : (
              <h3 className="font-semibold capitalize">{activeView}</h3>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Users className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <MembersList members={membersInfo} />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 min-h-0">
          {selectedChannel ? (
            <MessageArea channel={selectedChannel} />
          ) : (
            <div className="h-full p-4">
              {/* Render different views based on activeView */}
              {activeView === "tasks" && <TasksView />}
              {activeView === "milestones" && <MilestonesView />}
              {activeView === "files" && <FilesView />}
              {activeView === "calendar" && <CalendarView />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
