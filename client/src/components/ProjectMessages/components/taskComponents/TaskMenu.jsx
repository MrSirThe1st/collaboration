// src/components/tasks/TaskMenu.jsx
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Check } from "lucide-react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { deleteTask } from "@/redux/taskMilestoneSlice";
import { TASK_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const TaskMenu = ({ task }) => {
  const dispatch = useDispatch();

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer p-1 hover:bg-secondary rounded-sm">
          <MoreHorizontal className="h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Check className="mr-2 h-4 w-4" /> Mark as Complete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskMenu;
