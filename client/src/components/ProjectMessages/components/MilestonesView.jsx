import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Plus, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

const MilestonesView = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const [showNewMilestoneDialog, setShowNewMilestoneDialog] = useState(false);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Milestones</h2>
          <p className="text-muted-foreground">Track project progress</p>
        </div>
        <Button onClick={() => setShowNewMilestoneDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid gap-6 pb-6">
          {milestones.map((milestone) => (
            <Card key={milestone.id} className="relative">
              <div className="absolute top-0 left-0 w-full h-1">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${milestone.progress}%` }}
                />
              </div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-6">
                <div className="space-y-1">
                  <CardTitle>{milestone.title}</CardTitle>
                  <CardDescription>{milestone.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={getStatusBadge(milestone.status)}
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
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>Completed</span>
                      <Badge variant="outline">
                        {milestone.tasks?.completed || 0}/
                        {milestone.tasks?.total || 0} tasks
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Due {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <NewMilestoneDialog
        open={showNewMilestoneDialog}
        onOpenChange={setShowNewMilestoneDialog}
        newMilestone={newMilestone}
        setNewMilestone={setNewMilestone}
        handleCreateMilestone={handleCreateMilestone}
        loading={loading}
      />
    </div>
  );
};

export default MilestonesView;
