import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CHANNEL_API_END_POINT } from "@/utils/constant";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Hash,
  Bell,
  Users,
  Plus,
  Settings,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  addChannel,
  removeChannel,
  setSelectedChannel,
} from "@/redux/channelSlice";

const ChannelSystem = ({ projectId, isProjectOwner, membersInfo }) => {
  const [showNewChannelDialog, setShowNewChannelDialog] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: "",
    selectedRole: "",
  });

  const staticDefaultChannels = [
    { _id: "general", name: "general", type: "public" },
    { _id: "announcements", name: "announcements", type: "announcement" },
  ];

  //redux
  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channel);
  const selectedChannel = useSelector((state) => state.channel.selectedChannel);


  const getProjectRoles = () => {
    const roles = membersInfo.map((member) => member.role);
    return [...new Set(roles)]; // Remove duplicates
  };

  const getMembersByRole = (role) => {
    return membersInfo.filter((member) => member.role === role);
  };

  const getChannelIcon = (channelName) => {
    switch (channelName.toLowerCase()) {
      case "general":
        return <Hash className="h-4 w-4" />;
      case "announcements":
        return <Bell className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleCreateChannel = async () => {
    try {
      if (!newChannel.name.trim()) {
        toast.error("Channel name is required");
        return;
      }

      if (!newChannel.selectedRole) {
        toast.error("Please select a role for the channel");
        return;
      }

      const roleMembers = getMembersByRole(newChannel.selectedRole);
      const memberIds = roleMembers.map((member) => member._id);

      const formattedName = newChannel.name.toLowerCase().replace(/\s+/g, "-");

      const response = await axios.post(
        `${CHANNEL_API_END_POINT}/create`,
        {
          name: formattedName,
          role: newChannel.selectedRole,
          projectId,
          members: memberIds,
        },

        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(addChannel(response.data.channel));
        setShowNewChannelDialog(false);
        setNewChannel({ name: "", selectedRole: "" });
        toast.success("Channel created successfully");
      }
    } catch (error) {
      console.error("Error creating channel:", error);
      toast.error(error.response?.data?.message || "Failed to create channel");
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      const response = await axios.delete(
        `${CHANNEL_API_END_POINT}/delete/${channelId}`,
        { withCredentials: true },
        { data: projectId }
      );

      if (response.data.success) {
        dispatch(removeChannel(channelId));
        if (selectedChannel?._id === channelId) {
          dispatch(setSelectedChannel(null));
        }
        toast.success("Channel deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
      toast.error("Failed to delete channel");
    }
  };



  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-2 p-2">
          {/* Default Channels */}
          <div className="space-y-[2px]">
            {staticDefaultChannels.map((channel) => (
              <button
                key={channel._id}
                className={cn(
                  "w-full flex items-center gap-2 p-2 rounded-md",
                  "hover:bg-accent text-sm",
                  selectedChannel?._id === channel._id && "bg-accent"
                )}
                onClick={() => dispatch(setSelectedChannel(channel))}
              >
                {getChannelIcon(channel.name)}
                <span className="flex-1 text-left capitalize">
                  {channel.name}
                </span>
              </button>
            ))}
          </div>

          {/* Always show Role Channels section with create button */}
          <Separator />
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Create a channel
            </h3>
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

          {/* Role Channels */}
          <div className="space-y-[2px]">
            {channels
              .filter(
                (channel) =>
                  !["general", "announcements"].includes(
                    channel.name.toLowerCase()
                  )
              )
              .map((channel) => (
                <div key={channel._id} className="group relative">
                  <button
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-md",
                      "hover:bg-accent text-sm",
                      selectedChannel?._id === channel._id && "bg-accent"
                    )}
                    onClick={() => dispatch(setSelectedChannel(channel))}
                  >
                    {getChannelIcon(channel.name)}
                    <span className="flex-1 text-left">{channel.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {channel.role}
                    </Badge>
                    {isProjectOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 absolute right-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChannel(channel._id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Channel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </button>
                </div>
              ))}
          </div>
        </div>
      </ScrollArea>

      {/* Create Channel Dialog */}
      <Dialog
        open={showNewChannelDialog}
        onOpenChange={setShowNewChannelDialog}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Channel</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Channel Name</Label>
              <Input
                id="name"
                value={newChannel.name}
                onChange={(e) =>
                  setNewChannel({
                    ...newChannel,
                    name: e.target.value,
                  })
                }
                placeholder="Enter channel name"
              />
            </div>
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select
                value={newChannel.selectedRole}
                onValueChange={(value) =>
                  setNewChannel({
                    ...newChannel,
                    selectedRole: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  {getProjectRoles().map((role) => (
                    <SelectItem key={role} value={role}>
                      <div className="flex items-center justify-between w-full">
                        <span>{role}</span>
                        <span className="text-xs text-muted-foreground">
                          ({getMembersByRole(role).length} members)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newChannel.selectedRole && (
              <div className="space-y-2">
                <Label>Members with this role</Label>
                <div className="bg-muted p-2 rounded-md max-h-32 overflow-y-auto">
                  {getMembersByRole(newChannel.selectedRole).map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center gap-2 py-1"
                    >
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{member.username}</span>
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

export default ChannelSystem;
