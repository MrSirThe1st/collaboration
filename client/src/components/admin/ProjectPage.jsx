import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setSingleProject } from "@/redux/projectSlice";
import { PROJECT_API_END_POINT, CHANNEL_API_END_POINT } from "@/utils/constant";
import CalendarView from "../ProjectMessages/components/CalendarView";
import MembersList from "../ProjectMessages/MembersList";
import MessageArea from "../ProjectMessages/MessagesArea";
import FilesView from "../ProjectMessages/components/FilesView";
import MilestonesView from "../ProjectMessages/components/MilestonesView";
import TasksView from "../ProjectMessages/components/TasksView";
import ChannelSystem from "../ProjectMessages/ChannelSystem";
import {
  Hash,
  Users,
  Settings,
  Bell,
  ListTodo,
  Milestone,
  FileText,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import useGetProjectChannels from "@/hooks/useGetProjectChannel";
import { setSelectedChannel } from "@/redux/channelSlice";

const ProjectPage = () => {
  // Core state
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.singleProject);
  const user = useSelector((state) => state.auth.user);
  const [membersInfo, setMembersInfo] = useState([]);

  useGetProjectChannels(id);

  //redux
  const { channels } = useSelector((state) => state.channel);
  const selectedChannel = useSelector((state) => state.channel.selectedChannel);

  // View state
  const [activeView, setActiveView] = useState("tasks");
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isProjectOwner = project?.created_by === user?._id;

  // Fetch project data
  const fetchProject = async () => {
    try {
      const response = await axios.get(`${PROJECT_API_END_POINT}/get/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setSingleProject(response.data.project));
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to fetch project details");
    }
  };


  // Fetch project data and set up polling
  useEffect(() => {
    fetchProject();
    const pollInterval = setInterval(fetchProject, 30000);
    return () => clearInterval(pollInterval);
  }, [id]);


  // Fetch member information
  useEffect(() => {
    if (project?.members) {
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
          toast.error("Failed to fetch member information");
        }
      };
      fetchMembersInfo();
    }
  }, [project?.members]);

  if (!project) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Project Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 border-r">
        {/* Project Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg truncate">{project.title}</h2>
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
            <Badge variant="secondary">{project.status}</Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {membersInfo.length}
            </Badge>
          </div>
        </div>

        {/* Channel System */}
        <ChannelSystem
          projectId={id}
          isProjectOwner={isProjectOwner}
          membersInfo={membersInfo}
        />

        <Separator className="my-2" />

        {/* Quick Access */}
        <div className="p-2">
          <h3 className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
            Quick Access
          </h3>
          <div className="space-y-[2px]">
            {[
              { id: "tasks", icon: ListTodo, label: "Tasks" },
              { id: "milestones", icon: Milestone, label: "Milestones" },
              { id: "files", icon: FileText, label: "Files" },
              { id: "calendar", icon: Calendar, label: "Calendar" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-md",
                  "hover:bg-accent text-sm",
                  activeView === id && "bg-accent"
                )}
                onClick={() => {
                  setActiveView(id);
                  dispatch(setSelectedChannel(null));
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 mt-auto border-t">
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
        {/* Header */}
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

        {/* Content Area */}
        <div className="flex-1 min-h-0">
          {selectedChannel ? (
            <MessageArea channel={selectedChannel} />
          ) : (
            <div className="h-full p-4">
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
