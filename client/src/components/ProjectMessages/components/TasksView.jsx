import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import {
  setTasks,
  updateTasksOrder,
  addTask,
} from "@/redux/taskMilestoneSlice";
import { TASK_API_END_POINT } from "@/utils/constant";
import TaskCard from "./taskComponents/TaskCard";
import NewTaskDialog from "./taskComponents/NewTaskDialog";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TasksView = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const [showNewTaskDialog, setShowNewTaskDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get data from Redux store
  const tasks = useSelector((state) => state.taskMilestone.tasks);
  const milestones = useSelector((state) => state.taskMilestone.milestones);
  const canCreateTask = milestones && milestones.length > 0;
  const taskFilters = useSelector((state) => state.taskMilestone.taskFilters);
  const members = useSelector(
    (state) => state.project.singleProject?.members || []
  );

  // Local state for new task form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedRole: "",
    milestoneId: "",
    dueDate: "",
  });

  // Organized tasks by status
const columns = {
  todo: {
    id: "todo",
    title: "To Do",
    tasks: tasks.filter((task) => task.status === "todo"),
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    tasks: tasks.filter((task) => task.status === "in_progress"),
  },
  done: {
    id: "done",
    title: "Done",
    tasks: tasks.filter((task) => task.status === "completed"),
  },
};

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${TASK_API_END_POINT}/project/${projectId}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setTasks(res.data.tasks));
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId, dispatch]);

  // Handle drag end
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    try {
      // Map the droppableId to the correct status value
      const statusMap = {
        todo: "todo",
        inProgress: "in_progress",
        done: "completed",
      };

      const newStatus = statusMap[destination.droppableId];

      // Find the task that's being moved
      const updatedTask = tasks.find((task) => task._id === draggableId);

      // Optimistically update the task in Redux before the API call
      const updatedTasks = tasks.map((task) =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      );

      // Update Redux immediately
      dispatch(setTasks(updatedTasks));

      // Make API call
      const response = await axios.patch(
        `${TASK_API_END_POINT}/status/${draggableId}`,
        {
          status: newStatus,
        },
        { withCredentials: true }
      );

      if (!response.data.success) {
        dispatch(setTasks(tasks));
        toast.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      // Revert changes on error
      dispatch(setTasks(tasks));
      toast.error(
        error.response?.data?.message || "Failed to update task status"
      );
    }
  };

  // Create new task
  const handleCreateTask = async () => {
    try {
      if (!milestones || milestones.length === 0) {
        toast.error("Cannot create task without a milestone");
        return;
      }

      if (!newTask.assignedRole) {
        toast.error("Please select a role for the task");
        return;
      }

      setLoading(true);

      // Find all users with the selected role
      const assignedUsers = members
        .filter((member) => member.role === newTask.assignedRole)
        .map((member) => ({
          user: member.user,
          role: member.role,
        }));

      const taskData = {
        ...newTask,
        assignees: assignedUsers,
        milestoneId:
          newTask.milestoneId === "none" ? null : newTask.milestoneId,
      };

      const res = await axios.post(
        `${TASK_API_END_POINT}/create`,
        { ...taskData, projectId },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(addTask(res.data.task));
        setShowNewTaskDialog(false);
        setNewTask({
          title: "",
          description: "",
          priority: "medium",
          assignedRole: "",
          milestoneId: "",
          dueDate: "",
        });
        toast.success("Task created successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500 ring-red-500/30";
      case "medium":
        return "bg-yellow-500 ring-yellow-500/30";
      case "low":
        return "bg-green-500 ring-green-500/30";
      default:
        return "bg-gray-500 ring-gray-500/30";
    }
  };
  console.log("Members data:", members);
  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {loading ? "Loading tasks..." : `${tasks.length} total tasks`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={taskFilters.assignee}
            onValueChange={(value) =>
              dispatch(setTaskFilters({ assignee: value }))
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              {members.map(
                (member) =>
                  member.user && (
                    <SelectItem
                      key={member.user}
                      value={
                        typeof member.user === "string"
                          ? member.user
                          : member.user._id
                      }
                    >
                      {member.role || "Unknown Role"}
                    </SelectItem>
                  )
              )}
            </SelectContent>
          </Select>
          <Button
            onClick={() => setShowNewTaskDialog(true)}
            disabled={!canCreateTask}
            title={!canCreateTask ? "Create a milestone first" : "Add new task"}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
      {!canCreateTask && (
        <div className="text-center py-4 text-muted-foreground">
          Please create a milestone before adding tasks.
        </div>
      )}
      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(columns).map((column) => (
            <div key={column.id}>
              <div className="mb-3">
                <h3 className="font-medium flex items-center gap-2">
                  {column.title}
                  <Badge variant="secondary">{column.tasks.length}</Badge>
                </h3>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {column.tasks.map((task, index) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        index={index}
                        getPriorityColor={getPriorityColor}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* New Task Dialog */}
      <NewTaskDialog
        open={showNewTaskDialog}
        onOpenChange={setShowNewTaskDialog}
        newTask={newTask}
        setNewTask={setNewTask}
        handleCreateTask={handleCreateTask}
        loading={loading}
        milestones={milestones}
        members={members}
      />
    </div>
  );
};

export default TasksView;
