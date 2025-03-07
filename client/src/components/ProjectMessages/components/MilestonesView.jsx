import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Trash2,
  Loader,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { setMilestones } from "@/redux/taskMilestoneSlice";
import { MILESTONE_API_END_POINT } from "@/utils/constant";
import NewMilestoneDialog from "./milestoneComponents/NewMilestoneDialog";

const MilestonesView = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const [showNewMilestoneDialog, setShowNewMilestoneDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get milestones from Redux store
  const milestones = useSelector((state) => state.taskMilestone.milestones);

  // New milestone form state
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  // Fetch milestones on component mount
  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${MILESTONE_API_END_POINT}/project/${projectId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setMilestones(res.data.milestones));
        }
      } catch (error) {
        toast.error("Failed to fetch milestones");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchMilestones();
    }
  }, [projectId, dispatch]);

  // Handle milestone creation
  const handleCreateMilestone = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${MILESTONE_API_END_POINT}/create`,
        {
          ...newMilestone,
          projectId,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setMilestones([...milestones, res.data.milestone]));
        setShowNewMilestoneDialog(false);
        setNewMilestone({
          title: "",
          description: "",
          dueDate: "",
        });
        toast.success("Milestone created successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create milestone"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500" />;
      case "in_progress":
        return <Clock className="text-blue-500" />;
      case "at_risk":
        return <AlertCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: "bg-green-500/10 text-green-500",
      in_progress: "bg-blue-500/10 text-blue-500",
      at_risk: "bg-red-500/10 text-red-500",
    };

    return variants[status] || "";
  };

  const handleDeleteMilestone = async () => {
    if (!milestoneToDelete) return;

    try {
      setLoading(true);
      const res = await axios.delete(
        `${MILESTONE_API_END_POINT}/delete/${milestoneToDelete._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(
          setMilestones(
            milestones.filter((m) => m._id !== milestoneToDelete._id)
          )
        );
        toast.success("Milestone and its tasks deleted successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete milestone"
      );
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
      setMilestoneToDelete(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div
        className={cn(
          "mb-4 sm:mb-6",
          isMobile ? "flex flex-col gap-3" : "flex items-center justify-between"
        )}
      >
        <div>
          <p
            className={cn(
              "text-muted-foreground",
              isMobile ? "text-xs" : "text-sm"
            )}
          >
            Track project progress
          </p>
        </div>
        <Button
          onClick={() => setShowNewMilestoneDialog(true)}
          size={isMobile ? "sm" : "default"}
          className={isMobile ? "w-full" : ""}
          disabled={loading}
        >
          <Plus className={cn("mr-2", isMobile ? "h-3 w-3" : "h-4 w-4")} />
          Add Milestone
        </Button>
      </div>

      <ScrollArea
        className={cn(
          "flex-1",
          isMobile ? "h-[calc(100vh-270px)]" : "h-[calc(100vh-200px)]"
        )}
      >
        <div className="grid gap-4 sm:gap-6 pb-6">
          {milestones.map((milestone) => (
            <Card key={milestone._id} className="relative">
              <div className="absolute top-0 left-0 w-full h-1">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>
              <CardHeader
                className={cn(
                  "flex flex-row items-start justify-between space-y-0 pb-2 pt-6",
                  isMobile ? "p-3" : "p-6"
                )}
              >
                <div className="space-y-1">
                  <CardTitle className={isMobile ? "text-base" : "text-lg"}>
                    {milestone.title}
                  </CardTitle>
                  <CardDescription className={isMobile ? "text-xs" : "text-sm"}>
                    {milestone.description}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMilestoneToDelete(milestone);
                      setShowDeleteDialog(true);
                    }}
                    disabled={loading}
                  >
                    <Trash2 className={isMobile ? "h-3.5 w-3.5" : "h-4 w-4"} />
                  </Button>
                  <Badge
                    variant="secondary"
                    className={cn(
                      getStatusBadge(milestone.status),
                      isMobile ? "text-xs px-2 py-0.5" : ""
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {getStatusIcon(milestone.status)}
                      <span className="capitalize">
                        {milestone.status.replace("_", " ")}
                      </span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className={isMobile ? "p-3 pt-0" : ""}>
                <div className="space-y-4">
                  <div
                    className={cn(
                      "flex justify-between",
                      isMobile ? "text-xs flex-col gap-2" : "text-sm flex-row"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span>Completed</span>
                      <Badge
                        variant="outline"
                        className={isMobile ? "text-xs" : ""}
                      >
                        {milestone.tasks?.completed || 0}/
                        {milestone.tasks?.total || 0} tasks
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                      <span>
                        Due {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {milestones.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <p className={isMobile ? "text-sm" : ""}>
                No milestones added yet
              </p>
            </div>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <span className="animate-spin">
                <Clock className={isMobile ? "h-6 w-6" : "h-8 w-8"} />
              </span>
            </div>
          )}
        </div>
      </ScrollArea>

      <NewMilestoneDialog
        open={showNewMilestoneDialog}
        onOpenChange={setShowNewMilestoneDialog}
        newMilestone={newMilestone}
        setNewMilestone={setNewMilestone}
        handleCreateMilestone={handleCreateMilestone}
        loading={loading}
        isMobile={isMobile}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className={isMobile ? "w-[95%] p-4" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle className={isMobile ? "text-base" : ""}>
              Delete Milestone
            </AlertDialogTitle>
            <AlertDialogDescription className={isMobile ? "text-xs" : ""}>
              Are you sure you want to delete this milestone? This will also
              delete all tasks associated with this milestone. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isMobile ? "flex-col space-y-2" : ""}>
            <AlertDialogCancel className={isMobile ? "w-full mt-0" : ""}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                isMobile ? "w-full" : ""
              )}
              onClick={handleDeleteMilestone}
              disabled={loading}
            >
              {loading ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MilestonesView;
