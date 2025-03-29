import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setSingleProject } from "@/redux/projectSlice";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { setSelectedChannel } from "@/redux/channelSlice";
import useGetProjectChannels from "@/hooks/useGetProjectChannel";
import {
  Hash,
  Users,
  ListTodo,
  Milestone,
  FileText,
  Bell,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Lazy-loaded components
const MembersList = lazy(() => import("../ProjectMessages/MembersList"));
const ProjectMessagesArea = lazy(() =>
  import("../ProjectMessages/projectMessagesArea")
);
const FilesView = lazy(() => import("../ProjectMessages/components/FilesView"));
const MilestonesView = lazy(() =>
  import("../ProjectMessages/components/MilestonesView")
);
const TasksView = lazy(() => import("../ProjectMessages/components/TasksView"));
const ChannelSystem = lazy(() => import("../ProjectMessages/ChannelSystem"));
const AnnouncementsChannel = lazy(() =>
  import("../ProjectMessages/components/AnnouncementsChannel")
);
const GeneralChannel = lazy(() =>
  import("../ProjectMessages/components/GeneralChannel")
);
const RoleBasedChannel = lazy(() =>
  import("../ProjectMessages/components/RoleBasedChannel")
);

// Fallback loader component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-full">
    <Loader className="h-8 w-8 animate-spin" />
  </div>
);

const ProjectPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const project = useSelector((state) => state.project.singleProject);
  const user = useSelector((state) => state.auth.user);
  const { channels } = useSelector((state) => state.channel);
  const selectedChannel = useSelector((state) => state.channel.selectedChannel);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);

  // State hooks
  const [membersInfo, setMembersInfo] = useState([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState("tasks");
  const [isLoading, setIsLoading] = useState(true);

  // Custom hooks
  useGetProjectChannels(id);

  // Computed values
  const isProjectOwner = project?.created_by === user?._id;

  // Fetch project data - memoized with useCallback to prevent recreating on each render
  const fetchProject = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${PROJECT_API_END_POINT}/get/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        dispatch(setSingleProject(response.data.project));
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to fetch project details");
    } finally {
      setIsLoading(false);
    }
  }, [id, dispatch]);

  // Handle leaving project
  const handleLeaveProject = async () => {
    try {
      const response = await axios.post(
        `${PROJECT_API_END_POINT}/leave/${id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Successfully left the project");
        navigate("/workspace");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to leave project");
    }
    setShowLeaveDialog(false);
  };

  // Fetch member information
  const fetchMembersInfo = useCallback(async () => {
    if (!project?.members || project.members.length === 0) return;

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
  }, [project?.members]);

  // Handle window resize for responsive design
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    // Initial project fetch
    fetchProject();

    // Set up polling at a reasonable interval (every 30 seconds)
    const pollInterval = setInterval(fetchProject, 30000);

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Initial check for mobile/desktop
    handleResize();

    // Cleanup function
    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, [fetchProject, handleResize]);

  // Fetch member information when project changes
  useEffect(() => {
    if (project?.members) {
      fetchMembersInfo();
    }
  }, [project?.members, fetchMembersInfo]);

  // Loading state
  if (isLoading && !project) {
    return <LoadingFallback />;
  }

  return (
    <div
      className={cn(
        "h-screen flex bg-background",
        isMobile ? "flex-col overflow-y-auto" : "flex-row overflow-hidden"
      )}
    >
      {/* Project Sidebar - Responsive design with conditional rendering */}
      <div
        className={cn(
          isMobile
            ? "h-auto border-b w-full"
            : "hidden lg:flex lg:flex-col lg:w-full border-r shrink-0"
        )}
      >
        {/* Project Header */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg truncate">{project?.title}</h2>
          </div>

          {/* Additional info for mobile view */}
          {isMobile && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="secondary">{membersInfo.length} Members</Badge>
              <Badge variant="secondary">{channels.length} Channels</Badge>
            </div>
          )}
        </div>

        {/* Channel System - adjust height based on device */}
        <div
          className={cn("overflow-y-auto", isMobile ? "max-h-64" : "flex-1")}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ChannelSystem
              projectId={id}
              isProjectOwner={isProjectOwner}
              membersInfo={membersInfo}
              isMobile={isMobile}
            />
          </Suspense>
        </div>

        <Separator className="my-2" />

        {/* Quick Access Buttons */}
        <div className="p-2">
          <div
            className={cn(
              "grid",
              isMobile ? "grid-cols-3 gap-2" : "grid-cols-1 gap-1"
            )}
          >
            {[
              { id: "tasks", icon: ListTodo, label: "Tasks" },
              { id: "milestones", icon: Milestone, label: "Milestones" },
              { id: "files", icon: FileText, label: "Files" },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-md",
                  "hover:bg-accent text-sm transition-colors",
                  activeView === id && "bg-accent",
                  isMobile && "justify-center"
                )}
                onClick={() => {
                  setActiveView(id);
                  dispatch(setSelectedChannel(null));
                  if (isMobile) setMobileMenuOpen(false);
                }}
              >
                <Icon className="h-4 w-4" />
                <span className={cn(isMobile && "sr-only")}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0",
          isMobile ? "h-full" : "overflow-hidden"
        )}
      >
        {/* Responsive Header */}
        <header
          className={cn(
            "h-14 px-2 py-2 flex items-center justify-between",
            "border-b",
            isMobile ? "sticky top-0 bg-background z-10" : ""
          )}
        >
          <div className="flex items-center gap-2">
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
          </div>

          {/* Action Buttons */}
          <div className="flex items-center ">
            {!isProjectOwner && (
              <Button
                variant="destructive"
                onClick={() => setShowLeaveDialog(true)}
                size="sm"
                className={cn(isMobile && "text-xs")}
              >
                Leave Project
              </Button>
            )}

            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-4 w-4" />
            </Button>

            {/* Members Sheet */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 relative"
                  aria-label="View members"
                >
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-xs">
                      {membersInfo.length}
                    </span>
                    <Users className="h-4 w-4 ml-3" />
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isMobile ? "bottom" : "right"}
                className={cn(
                  isMobile ? "h-[80vh] rounded-t-xl" : "w-full sm:max-w-md"
                )}
              >
                <Suspense fallback={<LoadingFallback />}>
                  <MembersList
                    members={membersInfo}
                    onClose={() => setIsSheetOpen(false)}
                    isMobile={isMobile}
                  />
                </Suspense>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Content Area with Suspense for each component */}
        <div
          className={cn("flex-1 min-h-0", isMobile ? "pb-20" : "overflow-auto")}
        >
          <Suspense fallback={<LoadingFallback />}>
            {selectedChannel ? (
              <>
                {selectedChannel.type === "announcement" ? (
                  <AnnouncementsChannel
                    channel={selectedChannel}
                    isMobile={isMobile}
                  />
                ) : selectedChannel.type === "default" ? (
                  <GeneralChannel
                    channel={selectedChannel}
                    isMobile={isMobile}
                  />
                ) : selectedChannel.type === "role-based" ? (
                  <RoleBasedChannel
                    channel={selectedChannel}
                    isMobile={isMobile}
                  />
                ) : (
                  <ProjectMessagesArea
                    channel={selectedChannel}
                    projectId={project._id}
                    isMobile={isMobile}
                  />
                )}
              </>
            ) : (
              <div className="h-full p-4">
                {activeView === "tasks" && <TasksView isMobile={isMobile} />}
                {activeView === "milestones" && (
                  <MilestonesView isMobile={isMobile} />
                )}
                {activeView === "files" && <FilesView isMobile={isMobile} />}
              </div>
            )}
          </Suspense>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      {isMobile && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[80vw] max-w-[300px]">
            <div className="h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="font-semibold">{project?.title}</h2>
              </div>
              <Suspense fallback={<LoadingFallback />}>
                <ChannelSystem
                  projectId={id}
                  isProjectOwner={isProjectOwner}
                  membersInfo={membersInfo}
                  isMobile={true}
                  onChannelSelect={() => setMobileMenuOpen(false)}
                />
              </Suspense>
            </div>
          </SheetContent>
        </Sheet>
      )}

      {/* Leave Project Dialog */}
      <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave this project? You will lose access
              to all project resources and channels.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveProject}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Leave Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectPage;
