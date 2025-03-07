import { useState, useEffect, useContext, createContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { incrementUnreadCount } from "@/redux/inboxSlice";
import { addNotification } from "@/redux/notificationSlice";
import { addNewInvitation } from "@/redux/invitationSlice";
import { SOCKET_URL } from "@/utils/constant";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (user?._id) {
      const newSocket = io(
        SOCKET_URL,
        {
          query: {
            userId: user._id,
          },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        }
      );

      newSocket.on("connect", () => {
        console.log("Socket connected");
        setConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
        setConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setConnected(false);
      });

      newSocket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [user?._id]);

  useEffect(() => {
    if (!socket || !user) return;

    // Handle direct messages
    const handleNewMessage = (message) => {
      if (message.sender._id !== user._id) {
        dispatch(incrementUnreadCount(message.conversation));

        // Show browser notification if permitted
        if (Notification.permission === "granted") {
          new Notification(`New message from ${message.sender.username}`, {
            body: message.content,
            icon: message.sender.profile?.profilePhoto,
          });
        }
      }
    };

    // Handle notifications
    const handleNewNotification = (notification) => {
      console.log("Received notification in SocketContext:", notification);
      dispatch(addNotification(notification));

      // Show browser notification if permitted
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.content,
        });
      }
    };

    // Handle invitations
    const handleNewInvitation = (invitation) => {
      console.log("Received invitation in SocketContext:", invitation);
      dispatch(addNewInvitation(invitation));

      // Play sound for invitation
      try {
        const audio = new Audio("/notification-sound.mp3");
        audio.play().catch((e) => console.error("Error playing sound:", e));
      } catch (error) {
        console.error("Could not play notification sound:", error);
      }
    };

    socket.on("new_direct_message", handleNewMessage);
    socket.on("new_notification", handleNewNotification);
    socket.on("new_invitation", handleNewInvitation);

    return () => {
      socket.off("new_direct_message", handleNewMessage);
      socket.off("new_notification", handleNewNotification);
      socket.off("new_invitation", handleNewInvitation);
    };
  }, [socket, user, dispatch]);

  // Request notification permission
  useEffect(() => {
    if (user && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
