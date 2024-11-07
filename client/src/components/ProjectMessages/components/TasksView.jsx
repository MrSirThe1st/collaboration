import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";

const TasksView = () => {
  const [columns, setColumns] = useState({
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Design homepage",
          assignee: "John",
          priority: "high",
        },
        {
          id: "2",
          title: "Setup database",
          assignee: "Sarah",
          priority: "medium",
        },
      ],
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: [
        {
          id: "3",
          title: "Implement auth",
          assignee: "Mike",
          priority: "high",
        },
      ],
    },
    done: {
      id: "done",
      title: "Done",
      tasks: [
        { id: "4", title: "Project setup", assignee: "Emma", priority: "low" },
      ],
    },
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceTasks = [...sourceCol.tasks];
    const destTasks =
      source.droppableId === destination.droppableId
        ? sourceTasks
        : [...destCol.tasks];

    const [removed] = sourceTasks.splice(source.index, 1);
    destTasks.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceCol,
        tasks: sourceTasks,
      },
      [destination.droppableId]: {
        ...destCol,
        tasks: destTasks,
      },
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tasks</h2>
          <p className="text-muted-foreground">Manage your project tasks</p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members</SelectItem>
              <SelectItem value="john">John Doe</SelectItem>
              <SelectItem value="sarah">Sarah Smith</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="w-4 h-4 mr-2" /> Add Task
          </Button>
        </div>
      </div>

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
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-card"
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{task.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Assigned to {task.assignee}
                                  </p>
                                </div>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
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
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TasksView;
