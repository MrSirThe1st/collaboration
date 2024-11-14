// Modifying the existing channel list section in your ProjectPage

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This goes inside your existing ProjectPage component
const ChannelsList = () => {
  const [showNewChannelDialog, setShowNewChannelDialog] = useState(false);
  const [channelType, setChannelType] = useState("public");
  const [selectedRoles, setSelectedRoles] = useState([]);

  // Integrate with your existing channels state
  const { channels, setChannels } = useProjectContext(); // You'll need to create this context

  return (
    <div className="p-2">
      <div className="flex items-center justify-between p-2">
        <h3 className="text-sm font-medium text-muted-foreground">Channels</h3>
        {isProjectOwner && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNewChannelDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Existing channel list */}
      <div className="space-y-[2px]">
        {channels.map((channel) => (
          <button
            key={channel.id}
            className={cn(
              "w-full flex items-center gap-2 p-2 rounded-md",
              "hover:bg-accent text-sm",
              selectedChannel?.id === channel.id && "bg-accent"
            )}
            onClick={() => setSelectedChannel(channel)}
          >
            {channel.type === "public" && <Hash className="h-4 w-4" />}
            {channel.type === "private" && <Lock className="h-4 w-4" />}
            {channel.type === "role-based" && <Users className="h-4 w-4" />}
            <span className="flex-1 text-left">{channel.name}</span>
            {channel.type !== "public" && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleManageMembers(channel)}
                  >
                    Manage Members
                  </DropdownMenuItem>
                  {channel.type === "role-based" && (
                    <DropdownMenuItem
                      onClick={() => handleManageRoles(channel)}
                    >
                      Manage Roles
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </button>
        ))}
      </div>

      {/* New Channel Dialog */}
      <Dialog
        open={showNewChannelDialog}
        onOpenChange={setShowNewChannelDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Channel Name</Label>
              <Input placeholder="e.g., project-updates" className="mt-1.5" />
            </div>
            <div>
              <Label>Channel Type</Label>
              <Select
                value={channelType}
                onValueChange={setChannelType}
                className="mt-1.5"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public Channel</SelectItem>
                  <SelectItem value="private">Private Channel</SelectItem>
                  <SelectItem value="role-based">Role-Based Channel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {channelType === "role-based" && (
              <div>
                <Label>Roles</Label>
                <div className="mt-1.5 space-y-2">
                  {project.roles.map((role) => (
                    <div key={role} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedRoles.includes(role)}
                        onCheckedChange={() => handleRoleToggle(role)}
                      />
                      <span>{role}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewChannelDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateChannel}>Create Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChannelsList;
