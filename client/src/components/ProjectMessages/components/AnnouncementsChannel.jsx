import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "date-fns";
import {
  MoreVertical,
  AlertCircle,
  Check,
  FileText,
  Trash2,
  Loader,
} from "lucide-react";
import { CHANNEL_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSocketContext } from "../../../../context/SocketContext";

const AnnouncementsChannel = ({ channel }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const project = useSelector((state) => state.project.singleProject);

  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    // Join the channel room when component mounts
    socket.emit("join_channel", channel._id);

    // Listen for new announcements
    const handleNewAnnouncement = (newAnnouncement) => {
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
    };

    socket.on("new_announcement", handleNewAnnouncement);

    return () => {
      socket.off("new_announcement", handleNewAnnouncement);
    };
  }, [channel._id, socket]);

  // Check if user is admin or project owner
  const canPostAnnouncement =
    project?.created_by === user?._id ||
    project?.members.some((m) => m.user === user?._id && m.role === "Admin");

  useEffect(() => {
    fetchAnnouncements();
  }, [channel._id]);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${CHANNEL_API_END_POINT}/${channel._id}/pinned`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setAnnouncements(response.data.messages);
      }
    } catch (error) {
      toast.error("Failed to load announcements");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;

    try {
      setSubmitting(true);
      const response = await axios.post(
        `${CHANNEL_API_END_POINT}/announcement`,
        {
          channelId: channel._id,
          content: newAnnouncement,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setAnnouncements((prev) => [response.data.announcement, ...prev]);
        setNewAnnouncement("");
        toast.success("Announcement posted successfully");
      }
    } catch (error) {
      console.error("Error posting announcement:", error);
      toast.error("Failed to post announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      const response = await axios.delete(
        `${CHANNEL_API_END_POINT}/message/${announcementId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setAnnouncements((prev) =>
          prev.filter((a) => a._id !== announcementId)
        );
        toast.success("Announcement deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete announcement"
      );
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("announcement_deleted", (messageId) => {
      setAnnouncements((prev) => prev.filter((a) => a._id !== messageId));
    });

    return () => {
      socket.off("announcement_deleted");
    };
  }, [socket]);

  const AnnouncementCard = ({ announcement }) => {
    const readByCount = announcement.readBy?.length || 0;
    const totalMembers = channel.members?.length || 0;

    return (
      <div className="p-4 border rounded-lg mb-4 bg-card">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={announcement.sender?.profile?.profilePhoto} />
              <AvatarFallback>
                {announcement.sender?.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{announcement.sender?.username}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(announcement.createdAt), "MMM d, yyyy h:mm a")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              {readByCount}/{totalMembers}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {announcement.sender._id === user?._id && (
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteAnnouncement(announcement._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="ml-11">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {announcement.content}
          </div>

          {announcement.attachments?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {announcement.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 border rounded-md text-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {canPostAnnouncement && (
        <div className="p-4 border-b">
          <Textarea
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Post an announcement..."
            className="mb-3"
          />
          <div className="flex items-center">
            <Button
              onClick={handlePostAnnouncement}
              disabled={submitting || !newAnnouncement.trim()}
            >
              Post Announcement
            </Button>
          </div>
        </div>
      )}

      {/* Announcements list */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>No announcements yet</p>
            {canPostAnnouncement && (
              <p className="text-sm">Be the first to make an announcement!</p>
            )}
          </div>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement._id}
              announcement={announcement}
            />
          ))
        )}
      </ScrollArea>
  
    </div>
  );
};

export default AnnouncementsChannel;
