import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";
import TaskMenu from "./TaskMenu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const TaskCard = React.memo(({ task, index, getPriorityColor }) => {
  const getUserInitials = (username) => {
    return username?.slice(0, 2).toUpperCase() || "??";
  };

  return (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-border/50 hover:border-border"
        >
          <div className="p-5">
            {/* Header Section */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2.5">
                {/* Task Title */}
                <h4 className="font-semibold text-base leading-none">
                  {task.title}
                </h4>

                {/* Milestone Badge */}
                {task.milestone?.title && (
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="px-2.5 py-0.5 text-xs font-medium bg-primary/5"
                    >
                      {task.milestone.title}
                    </Badge>
                  </div>
                )}
              </div>
              <TaskMenu task={task} />
            </div>

            {/* Content Section */}
            <div className="mt-4 space-y-4">
              {/* Role Assignment */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground shrink-0" />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="px-2.5 py-0.5 font-medium bg-secondary/50 text-secondary-foreground/80"
                      >
                        {task.assignedRole || "Unassigned"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="text-xs font-medium">Assigned to role</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Description Preview */}
              {task.description && (
                <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            {/* Footer Section */}
            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between gap-2">
              {/* Priority */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-background ${getPriorityColor(
                    task.priority
                  )}`}
                />
                <span className="text-xs font-medium text-muted-foreground/80 capitalize">
                  {task.priority} Priority
                </span>
              </div>

              {/* Due Date */}
              {task.dueDate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs font-medium text-muted-foreground/80">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 stroke-[1.5]" />
                        {new Date(task.dueDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="text-xs font-medium">Due date</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

TaskCard.displayName = "TaskCard";

export default TaskCard;
