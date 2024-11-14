import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { User, Calendar } from "lucide-react";
import TaskMenu from "./TaskMenu";

export const TaskCard = React.memo(({ task, index, getPriorityColor }) => (
  <Draggable key={task._id} draggableId={task._id} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="bg-card rounded-lg shadow-sm"
      >
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium">{task.title}</h4>
              {task.milestone && (
                <Badge variant="outline" className="mt-1">
                  {task.milestone.title}
                </Badge>
              )}
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                {task.assignees?.length > 0 ? (
                  <span>
                    {task.assignees.map((a) => a.user.username).join(", ")}
                  </span>
                ) : (
                  "Unassigned"
                )}
              </div>
            </div>
            <TaskMenu task={task} />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${getPriorityColor(
                task.priority
              )}`}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {task.priority} Priority
            </span>
            {task.dueDate && (
              <div className="ml-auto flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </Draggable>
));

export default TaskCard;
