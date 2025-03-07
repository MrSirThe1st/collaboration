import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { deleteTask, updateTask } from "@/redux/taskMilestoneSlice";
import { TASK_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TaskMenu = ({ task }) => {
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
    milestoneId: task.milestone?._id || task.milestone || "",
    assignedRole: task.assignedRole || "",
  });

  const milestones = useSelector((state) => state.taskMilestone.milestones);
  const project = useSelector((state) => state.project.singleProject);

  // Get available roles from project
  const availableRoles = project?.requirements || [];

  // Update formData when task changes
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
        milestoneId: task.milestone?._id || task.milestone || "",
        assignedRole: task.assignedRole || "",
      });
    }

    return () => {
      isMounted = false;
    };
  }, [task]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.delete(
        `${TASK_API_END_POINT}/delete/${task._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(deleteTask(task._id));
        toast.success("Task deleted successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsDialogOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleMarkComplete = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.patch(
        `${TASK_API_END_POINT}/status/${task._id}`,
        { status: "completed" },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(updateTask(res.data.task));
        toast.success("Task marked as complete");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending task update:", formData);

      // Use the edit endpoint
      const res = await axios.put(
        `${TASK_API_END_POINT}/edit/${task._id}`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(updateTask(res.data.task));
        toast.success("Task updated successfully");
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      console.error("Response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer p-1 hover:bg-secondary rounded-sm">
            <MoreHorizontal className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={handleMarkComplete}>
            <Check className="mr-2 h-4 w-4" /> Mark as Complete
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleSelectChange("priority", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Milestone selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Milestone</Label>
                <Select
                  value={formData.milestoneId}
                  onValueChange={(value) =>
                    handleSelectChange("milestoneId", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select milestone" />
                  </SelectTrigger>
                  <SelectContent>
                    {milestones.map((milestone) => (
                      <SelectItem key={milestone._id} value={milestone._id}>
                        {milestone.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role selection */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Assigned Role</Label>
                <Select
                  value={formData.assignedRole}
                  onValueChange={(value) =>
                    handleSelectChange("assignedRole", value)
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskMenu;
