import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import axios from "axios";
import {
  MessageCircle,
  Bell,
  Calendar,
  User,
  Info,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const NotificationItem = ({
  notification,
  onMarkAsRead,
  closeSheet,
  onSheetClose,
}) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const getIcon = () => {
    switch (notification.type) {
      case "message":
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case "invitation":
        return <User className="h-5 w-5 text-green-500" />;
      case "project":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "task":
        return <Check className="h-5 w-5 text-amber-500" />;
      case "mention":
        return <Info className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification._id);
    }

    if (notification.type === "message") {
      let conversationId = null;
      if (notification.link && notification.link.includes("conversation=")) {
        const match = notification.link.match(/conversation=([^&]+)/);
        if (match && match[1]) {
          conversationId = match[1];
        }
      }

      if (conversationId && notification.relatedDoc) {
        if (onSheetClose) onSheetClose();
        navigate("/inbox", {
          state: {
            conversationId,
            messageId: notification.relatedDoc,
            startChat: true,
            existingChat: true,
            fromNotification: true,
          },
        });
        return;
      }
    }

    if (notification.type === "invitation") {
      if (onSheetClose) onSheetClose();
      navigate("/allInvitations");
      if (window.setActiveInvitationTab) {
        window.setActiveInvitationTab("invitationsIn");
      }
    }

    if (notification.link) {
      if (onSheetClose) onSheetClose(); 
      navigate(notification.link);
    }
  };



  const formatNotificationTime = (date) => {
    const notificationDate = new Date(date);
    const now = new Date();
    const diffInHours = (now - notificationDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return formatDistanceToNow(notificationDate, { addSuffix: true });
    } else {
      return format(notificationDate, "MMM d, h:mm a");
    }
  };


  const handleDeleteNotification = async (e) => {
    e.stopPropagation(); 
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${NOTIFICATION_API_END_POINT}/${notification._id}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        if (onMarkAsRead) {
          onMarkAsRead(notification._id, true); 
        }
        toast.success("Notification removed");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to remove notification");
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="group relative">
      <Button
        variant={notification.read ? "ghost" : "secondary"}
        className="w-full text-left justify-start items-start p-3 h-auto"
        onClick={handleClick}
      >
        <div className="flex gap-3 w-full min-w-0">
          <div className="shrink-0 mt-1 relative">
            {getIcon()}
            {!notification.read && (
              <div className="absolute -top-1 -left-1 w-2 h-2 rounded-full bg-primary"></div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-start gap-1">
            <div className="font-medium text-sm truncate w-full">
              {notification.title}
            </div>
            <div className="text-xs text-muted-foreground break-words w-full line-clamp-2">
              {notification.content}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {format(new Date(notification.createdAt), "MMM d, h:mm a")}
            </div>
          </div>
        </div>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
        onClick={handleDeleteNotification}
        disabled={isDeleting}
      >
        <Trash2 className="h-3 w-3 text-red-500" />
      </Button>
    </div>
  );
};

export default NotificationItem;
