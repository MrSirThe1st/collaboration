import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";

const MilestonesView = () => {
  const milestones = [
    {
      id: 1,
      title: "MVP Release",
      description: "Launch the minimum viable product",
      dueDate: "2024-12-01",
      progress: 75,
      status: "in_progress",
      tasks: {
        completed: 15,
        total: 20,
      },
    },
    {
      id: 2,
      title: "Beta Testing",
      description: "Conduct beta testing with selected users",
      dueDate: "2024-11-15",
      progress: 100,
      status: "completed",
      tasks: {
        completed: 8,
        total: 8,
      },
    },
  ];

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
        <Button>
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
                      <span>Progress</span>
                      <Badge variant="outline">
                        {milestone.tasks.completed}/{milestone.tasks.total}{" "}
                        tasks
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Due {new Date(milestone.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Progress value={milestone.progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MilestonesView;
