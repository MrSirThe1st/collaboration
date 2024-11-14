import React from "react";
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

const NewTaskDialog = ({
  open,
  onOpenChange,
  newTask,
  setNewTask,
  handleCreateTask,
  loading,
  milestones,
  members,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create New Task</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask({ ...newTask, description: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label>Priority</Label>
          <Select
            value={newTask.priority}
            onValueChange={(value) =>
              setNewTask({ ...newTask, priority: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Milestone</Label>
          <Select
            value={newTask.milestoneId}
            onValueChange={(value) =>
              setNewTask({ ...newTask, milestoneId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select milestone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Milestone</SelectItem>
              {milestones.map((milestone) => (
                <SelectItem key={milestone._id} value={milestone._id}>
                  {milestone.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Due Date</Label>
          <Input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
          />
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={handleCreateTask} disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default NewTaskDialog;
