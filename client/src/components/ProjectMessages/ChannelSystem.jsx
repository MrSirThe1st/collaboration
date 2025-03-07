import { useState } from "react";
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
import { Hash, Bell, Users, Plus, Trash2, MoreVertical, } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  addChannel,
  removeChannel,
  setSelectedChannel,
} from "@/redux/channelSlice";

const ChannelSystem = ({
  projectId,
  isProjectOwner,
  membersInfo,
  isMobile,
}) => {
  const [showNewChannelDialog, setShowNewChannelDialog] = useState(false);
  const [showMembersSheet, setShowMembersSheet] = useState(false);
  const [selectedChannelMembers, setSelectedChannelMembers] = useState([]);
  const [newChannel, setNewChannel] = useState({ name: "", selectedRole: "" });
  const [isLoading, setIsLoading] = useState(false);
  const project = useSelector((state) => state.project.singleProject);

  const dispatch = useDispatch();
  const { channels } = useSelector((state) => state.channel);
  const selectedChannel = useSelector((state) => state.channel.selectedChannel);

  const getProjectRoles = () => {
    const roles = membersInfo.map((member) => member.role);
    return [...new Set(roles)];
  };

  const getMembersByRole = (role) =>
    membersInfo.filter((member) => member.role === role);

  const getChannelIcon = (type) => {
    switch (type) {
      case "default":
        return <Hash className="h-4 w-4" />;
      case "announcement":
        return <Bell className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleViewChannelMembers = (channel) => {
    if (channel.type === "default" || channel.type === "announcement") {
      setSelectedChannelMembers(membersInfo);
    } else {
      setSelectedChannelMembers(getMembersByRole(channel.role));
    }
    setShowMembersSheet(true);
  };

  const handleCreateChannel = async () => {
    setIsLoading(true);
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

      // Now we can safely access project.created_by
      if (project && !memberIds.includes(project.created_by)) {
        memberIds.push(project.created_by);
      }

      const formattedName = newChannel.name.toLowerCase().replace(/\s+/g, "-");

      console.log("Members being sent:", memberIds); // Debug log

      const response = await axios.post(
        `${CHANNEL_API_END_POINT}/create`,
        {
          name: formattedName,
          role: newChannel.selectedRole,
          projectId,
          members: memberIds,
          type: "role-based",
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteChannel = async (channelId) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${CHANNEL_API_END_POINT}/delete/${channelId}`,
        { withCredentials: true }
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
    } finally {
      setIsLoading(false);
    }
  };

  const defaultChannels = channels.filter(
    (channel) => channel.type === "default" || channel.type === "announcement"
  );

  const roleChannels = channels.filter(
    (channel) => channel.type === "role-based"
  );

  const ChannelButton = ({ channel, canDelete = false, isMobile }) => (
    <div key={channel._id} className="group relative">
      <button
        className={cn(
          "w-full flex items-center gap-2 p-2 rounded-md",
          "hover:bg-accent text-sm",
          selectedChannel?._id === channel._id && "bg-accent"
        )}
        onClick={() => dispatch(setSelectedChannel(channel))}
      >
        {getChannelIcon(channel.type)}
        <span className="flex-1 text-left">{channel.name}</span>
        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 h-6 w-6"
          onClick={(e) => {
            e.stopPropagation();
            handleViewChannelMembers(channel);
          }}
        >
          <Users className="h-4 w-4" />
        </Button>
        {canDelete && isProjectOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 h-6 w-6"
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
  );

  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className={`h-full ${isMobile ? "px-2" : ""}`}>
        <div className="space-y-2">
          {/* Default Channels */}
          <div className="space-y-[2px]">
            {defaultChannels.map((channel) => (
              <ChannelButton
                key={channel._id}
                channel={channel}
                isMobile={isMobile}
              />
            ))}
          </div>

          {/* Role Channels section */}
          <Separator className={isMobile ? "my-4" : "my-2"} />

          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Role Channels
            </h3>
            {isProjectOwner && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNewChannelDialog(true)}
                className={isMobile ? "h-8 w-8" : ""}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-[2px]">
            {roleChannels.map((channel) => (
              <ChannelButton
                key={channel._id}
                channel={channel}
                canDelete
                isMobile={isMobile}
              />
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
                  setNewChannel({ ...newChannel, name: e.target.value })
                }
                placeholder="Enter channel name"
              />
            </div>
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select
                value={newChannel.selectedRole}
                onValueChange={(value) =>
                  setNewChannel({ ...newChannel, selectedRole: value })
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

      {/* Members Sheet */}
      <Sheet open={showMembersSheet} onOpenChange={setShowMembersSheet}>
        <SheetContent side="right">
          <div className="p-4">
            <h2 className="font-semibold mb-4">Channel Members</h2>
            <div className="space-y-2">
              {selectedChannelMembers.map((member) => (
                <div
                  key={member._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.profile?.profilePhoto} />
                    <AvatarFallback>
                      {member.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{member.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ChannelSystem;
