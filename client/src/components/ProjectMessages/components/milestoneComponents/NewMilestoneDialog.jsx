import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const NewMilestoneDialog = ({
  open,
  onOpenChange,
  newMilestone,
  setNewMilestone,
  handleCreateMilestone,
  loading,
  isMobile,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={isMobile ? "w-[95vw] max-w-md p-4" : "sm:max-w-[425px]"}
      >
        <DialogHeader>
          <DialogTitle>Create New Milestone</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newMilestone.title}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, title: e.target.value })
              }
              placeholder="Enter milestone title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newMilestone.description}
              onChange={(e) =>
                setNewMilestone({
                  ...newMilestone,
                  description: e.target.value,
                })
              }
              placeholder="Describe the milestone"
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={newMilestone.dueDate}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, dueDate: e.target.value })
              }
            />
          </div>
        </div>
        <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={isMobile ? "w-full" : ""}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateMilestone}
            disabled={loading || !newMilestone.title || !newMilestone.dueDate}
            className={isMobile ? "w-full" : ""}
          >
            {loading ? "Creating..." : "Create Milestone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewMilestoneDialog;
