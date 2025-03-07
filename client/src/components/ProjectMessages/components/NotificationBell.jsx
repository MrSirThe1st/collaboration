import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  setNotifications,
  markAsRead,
  addNotification,
  clearAllNotifications,
} from "@/redux/notificationSlice";
import { useSocketContext } from "../../../../context/SocketContext";
import axios from "axios";
import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
import NotificationItem from "./NotificationItem";
import { getUnreadInvitationsCount } from "@/redux/invitationSlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { socket } = useSocketContext();
  const { notifications, unreadCount } = useSelector(
    (state) => state.notification
  );

  // State to track if the sheet is open
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Get unread invitations count
  const unreadInvitations = useSelector(getUnreadInvitationsCount);

  // Calculate total unread count from all sources
  const totalUnreadCount = unreadCount + unreadInvitations;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(NOTIFICATION_API_END_POINT, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setNotifications(response.data.notifications));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      console.log("New notification received:", notification);
      dispatch(addNotification(notification));

      // Play notification sound
      try {
        const audio = new Audio("/notification-sound.mp3");
        audio.play().catch((e) => console.error("Error playing sound:", e));
      } catch (error) {
        console.error("Could not play notification sound:", error);
      }
    };

    socket.on("new_notification", handleNewNotification);
    socket.on("new_invitation", () => {
      // This will update notification count, handled by the invitationSlice
      // The actual notification is created by the server
    });

    return () => {
      socket.off("new_notification");
      socket.off("new_invitation");
    };
  }, [socket, dispatch]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await axios.patch(
        `${NOTIFICATION_API_END_POINT}/${notificationId}/read`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        dispatch(markAsRead(notificationId));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all as read on the server-side
      // This would be a new endpoint that needs to be implemented
      const response = await axios.patch(
        `${NOTIFICATION_API_END_POINT}/mark-all-read`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update Redux state - mark all as read
        dispatch(markAllAsRead());
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      const response = await axios.delete(
        `${NOTIFICATION_API_END_POINT}/clear-all`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(clearAllNotifications());
      }
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {totalUnreadCount > 0 && (
            <Badge className="absolute -top-0 -right-0 h-5 w-5 flex items-center justify-center bg-red-500 text-white">
              {totalUnreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="pr-0 w-full sm:max-w-md">
        <SheetHeader className="pb-4 space-y-0">
         
          {/* Mobile action buttons row */}
          <div className=" items-center gap-2 sm:hidden mt-2">
            {/* <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8 px-2"
              onClick={handleMarkAllAsRead}
            >
              <CheckCheck className="mr-1 h-3 w-3" />
              Mark all read
            </Button> */}
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-8 px-2"
              onClick={handleClearAllNotifications}
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Clear all
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 -mr-6 pr-6 h-[calc(100vh-150px)] sm:h-[calc(100vh-120px)]">
          <div className="flex flex-col gap-2">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 text-sm">
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onSheetClose={() => setIsSheetOpen(false)}
                />
              ))
            )}

            {unreadInvitations > 0 && (
              <div className="mt-4 pt-4 border-t border-dashed">
                <h3 className="text-sm font-medium mb-2">Invitations</h3>
                <Button
                  variant="outline"
                  className="w-full justify-start text-sm h-10"
                  onClick={() => {
                    setIsSheetOpen(false); // Close the sheet
                    window.location.href = "/allInvitations?tab=received";
                  }}
                >
                  <Badge className="mr-2 bg-red-500 text-xs">
                    {unreadInvitations}
                  </Badge>
                  You have {unreadInvitations} new invitation
                  {unreadInvitations !== 1 ? "s" : ""}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBell;
