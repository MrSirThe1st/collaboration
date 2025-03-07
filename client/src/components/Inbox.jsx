import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { MoreVertical, ArrowLeft, MessageCircle, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INBOX_API_END_POINT } from "@/utils/constant";
import {
  setConversations,
  setCurrentChat,
  setMessages,
  addMessage,
  setLoading,
  setError,
  clearUnreadCount,
  incrementUnreadCount,
  setInitialUnreadCounts,
} from "../redux/inboxSlice";
import { useSocketContext } from "../../context/SocketContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { NOTIFICATION_API_END_POINT } from "@/utils/constant";
import UserAvatar from "./customUI/UserAvatar";

const Inbox = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { conversations, currentChat, messages, loading } = useSelector(
    (state) => state.inbox
  );
  const [messageInput, setMessageInput] = useState("");
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const { userId, username, startChat } = location.state || {};
  const { socket } = useSocketContext();
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatArea, setShowChatArea] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Check for mobile view on component mount and window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);

      // If switching from mobile to desktop, make sure chat area is visible
      if (!mobile && !showChatArea) {
        setShowChatArea(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showChatArea]);

  // Socket event handlers for unread messages
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewMessage = (message) => {
      if (message.conversation !== currentChat?.conversationId) {
        dispatch(incrementUnreadCount(message.conversation));

        // Play notification sound for new messages
        try {
          const notificationSound = new Audio("/notification-sound.mp3");
          notificationSound
            .play()
            .catch((e) => console.log("Error playing sound:", e));
        } catch (error) {
          console.error("Error playing notification sound:", error);
        }
      } else {
        // If we're in the current conversation, add the message to the list
        dispatch(addMessage(message));
        scrollToBottom();
      }
    };

    socket.on("new_direct_message", handleNewMessage);
    return () => socket.off("new_direct_message", handleNewMessage);
  }, [socket, currentChat, user, dispatch]);

  // Fetch conversations on component mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${INBOX_API_END_POINT}/conversations`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setConversations(response.data.conversations));
          dispatch(setInitialUnreadCounts(response.data.conversations));
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchConversations();
  }, [dispatch]);

  // Join/leave chat rooms with socket
  useEffect(() => {
    if (!socket || !currentChat) return;

    // Join the direct message room
    socket.emit("join_dm", currentChat._id);

    // Socket event handlers
    const handleConversationUpdate = (updatedConversation) => {
      if (updatedConversation.participants.includes(user._id)) {
        dispatch(
          setConversations((prev) =>
            prev.map((conv) =>
              conv._id === updatedConversation._id ? updatedConversation : conv
            )
          )
        );
      }
    };

    const handleConversationDelete = (conversationId) => {
      if (currentChat?.conversationId === conversationId) {
        dispatch(setCurrentChat(null));
      }
      dispatch(
        setConversations((prev) =>
          prev.filter((conv) => conv._id !== conversationId)
        )
      );
    };

    socket.on("conversation_update", handleConversationUpdate);
    socket.on("conversation_deleted", handleConversationDelete);

    // Cleanup function
    return () => {
      socket.off("conversation_update", handleConversationUpdate);
      socket.off("conversation_deleted", handleConversationDelete);
      socket.emit("leave_dm", currentChat._id);
    };
  }, [socket, currentChat, user?._id, dispatch]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentChat) return;

      try {
        dispatch(setLoading(true));
        const response = await axios.get(
          `${INBOX_API_END_POINT}/conversation/${currentChat._id}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(setMessages(response.data.messages));

          // Mark notifications as read if coming from notification
          if (location.state?.fromNotification) {
            try {
              const notificationResponse = await axios.get(
                NOTIFICATION_API_END_POINT,
                { withCredentials: true }
              );

              if (notificationResponse.data.success) {
                const notificationsToMark =
                  notificationResponse.data.notifications.filter(
                    (n) =>
                      n.type === "message" &&
                      !n.read &&
                      n.link?.includes(
                        `conversation=${currentChat.conversationId}`
                      )
                  );

                // Mark these notifications as read
                await Promise.all(
                  notificationsToMark.map((n) =>
                    axios.patch(
                      `${NOTIFICATION_API_END_POINT}/${n._id}/read`,
                      {},
                      { withCredentials: true }
                    )
                  )
                );
              }
            } catch (error) {
              console.error("Error updating notifications:", error);
            }
          }

          // Scroll to bottom after messages load
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load messages");
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchMessages();
  }, [currentChat, dispatch, location.state?.fromNotification]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !currentChat || sendingMessage) return;

    try {
      setSendingMessage(true);
      const response = await axios.post(
        `${INBOX_API_END_POINT}/send`,
        {
          recipientId: currentChat._id,
          content: messageInput.trim(),
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Add the new message to the messages array
        dispatch(addMessage(response.data.message));
        setMessageInput("");

        // Update conversations list to show latest message
        const conversationsResponse = await axios.get(
          `${INBOX_API_END_POINT}/conversations`,
          { withCredentials: true }
        );

        if (conversationsResponse.data.success) {
          dispatch(setConversations(conversationsResponse.data.conversations));
        }

        // Scroll to bottom after sending message
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle deleting a conversation
  const handleDeleteConversation = async (conversationId) => {
    try {
      if (!conversationId) {
        toast.error("No conversation to delete");
        return;
      }

      const response = await axios.delete(
        `${INBOX_API_END_POINT}/conversation/${conversationId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Close chat area if we're deleting the currently open conversation
        if (currentChat?.conversationId === conversationId) {
          dispatch(setCurrentChat(null));
          if (isMobileView) {
            setShowChatArea(false);
          }
        }

        // Update conversations list
        dispatch(
          setConversations(
            conversations.filter((conv) => conv._id !== conversationId)
          )
        );

        toast.success("Conversation deleted");
      }
    } catch (error) {
      console.error("Delete conversation error:", error);
      toast.error("Failed to delete conversation please try again");
    }
  };

  // Select a conversation to chat with
  const handleSelectChat = async (user, conversation) => {
    dispatch(setMessages([]));
    dispatch(clearUnreadCount(conversation._id));

    dispatch(
      setCurrentChat({
        _id: user._id,
        username: user.username,
        profile: user.profile,
        conversationId: conversation._id,
        profession: user.profession,
        email: user.email,
      })
    );

    if (isMobileView) {
      setShowChatArea(true);
    }

    try {
      const response = await axios.get(
        `${INBOX_API_END_POINT}/conversation/${user._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(setMessages(response.data.messages));
        setTimeout(scrollToBottom, 100);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
      toast.error("Failed to load messages");
    }
  };

  // Handle direct navigation to chat from other pages
  useEffect(() => {
    if (startChat && userId) {
      dispatch(setMessages([]));

      // If we have a conversationId from notification
      if (location.state?.conversationId) {
        const conversation = conversations.find(
          (conv) => conv._id === location.state.conversationId
        );

        if (conversation) {
          const otherParticipant = conversation.participants.find(
            (p) => p._id !== user._id
          );

          if (otherParticipant) {
            handleSelectChat(otherParticipant, conversation);
            return;
          }
        }
      }

      // Otherwise set up a new chat
      dispatch(
        setCurrentChat({
          _id: userId,
          username: username,
          profilePhoto: location.state?.profilePhoto,
          conversationId: location.state?.conversationId,
        })
      );

      if (isMobileView) {
        setShowChatArea(true);
      }
    }
  }, [
    userId,
    startChat,
    conversations,
    location.state?.conversationId,
    user?._id,
    dispatch,
  ]);

  // Format timestamp for messages
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Empty state for no conversations
  const EmptyConversationsState = () => (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <MessageCircle className="h-12 w-12 text-muted-foreground mb-2" />
      <h3 className="font-medium text-lg">No Conversations Yet</h3>
      <p className="text-muted-foreground text-sm mt-1">
        Start a new conversation from the Team page
      </p>
      <Button
        variant="outline"
        className="mt-4"
        onClick={() => navigate("/team")}
      >
        Find People
      </Button>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div
        className={`${
          isMobileView && showChatArea
            ? "hidden"
            : "w-full md:w-72 border-r flex flex-col"
        } bg-background relative z-10`}
      >
        <div className="p-3 border-b">
          <h2 className="font-semibold">Messages</h2>
        </div>

        {/* Conversations List */}
        {loading && conversations.length === 0 ? (
          <div className="p-2 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-3 p-2"
              >
                <div className="w-8 h-8 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-3 w-32 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <EmptyConversationsState />
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {conversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(
                  (p) => p._id !== user._id
                );

                return (
                  <ConversationItem
                    key={conversation._id}
                    conversationId={conversation._id}
                    user={otherParticipant}
                    message={
                      conversation.lastMessage?.content || "No messages yet"
                    }
                    time={formatTimestamp(conversation.lastMessage?.createdAt)}
                    isSelected={currentChat?._id === otherParticipant?._id}
                    onClick={() =>
                      handleSelectChat(otherParticipant, conversation)
                    }
                    handleDeleteConversation={handleDeleteConversation}
                    isMobileView={isMobileView}
                  />
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>

      <div
        className={`${
          isMobileView && !showChatArea
            ? "hidden"
            : "fixed inset-0 md:static md:flex-1 flex flex-col"
        } bg-background z-20`}
      >
        {currentChat ? (
          <>
            {/* Chat Header with user info and options */}
            <div className="h-16 border-b flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                {/* Back button on mobile */}
                {isMobileView && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowChatArea(false)}
                    className="md:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}

                {/* User avatar and info */}
                <UserAvatar user={currentChat} size="sm" showStatus={false} />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-sm">
                    {currentChat.username}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {currentChat.profession || ""}
                  </div>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {loading && messages.length === 0 ? (
                // Loading skeleton for messages
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`animate-pulse flex items-start gap-3 ${
                        i % 2 === 0 ? "flex-row-reverse" : ""
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-muted shrink-0"></div>
                      <div
                        className={`flex-1 space-y-2 max-w-[70%] ${
                          i % 2 === 0 ? "items-end" : ""
                        }`}
                      >
                        <div className="h-4 w-24 bg-muted rounded"></div>
                        <div className="h-20 bg-muted rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <Message
                      key={message._id}
                      content={message.content}
                      timestamp={formatTimestamp(message.createdAt)}
                      isOwn={message.sender._id === user._id}
                      sender={message.sender}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            {/* Message Input Area */}
            <div className="p-3 border-t">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <Input
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1"
                  autoComplete="off"
                  disabled={sendingMessage}
                />
                <Button
                  type="submit"
                  disabled={!messageInput.trim() || sendingMessage}
                  size="icon"
                >
                  {sendingMessage ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          // Empty state when no conversation is selected
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 font-semibold">No Conversation Selected</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Choose a conversation from the sidebar or start a new one from
                the Team page
              </p>
              {isMobileView && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowChatArea(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Conversations
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Conversation Item Component
// ConversationItem component with hover action button
const ConversationItem = ({
  user,
  message,
  time,
  isSelected,
  onClick,
  conversationId,
  handleDeleteConversation,
  isMobileView, // Pass this prop from the parent component
}) => {
  const dispatch = useDispatch();
  const unreadCount = useSelector(
    (state) => state.inbox.unreadCounts[conversationId] || 0
  );
  const [isLongPress, setIsLongPress] = useState(false);
  const pressTimer = useRef(null);

  const handleClick = () => {
    onClick();
    dispatch(clearUnreadCount(conversationId));
  };

  const startPress = () => {
    if (isMobileView) {
      pressTimer.current = setTimeout(() => {
        setIsLongPress(true);
      }, 1000);
    }
  };

  const endPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  // Handle delete action
  const handleDelete = () => {
    setIsLongPress(false);
    handleDeleteConversation(conversationId);
  };

  // Handle cancel action
  const handleCancel = () => {
    setIsLongPress(false);
  };

  return (
    <div
      className="relative group flex items-center hover:bg-accent rounded-lg transition-colors"
      onClick={handleClick}
      onTouchStart={isMobileView ? startPress : undefined} // For mobile touch
      onTouchEnd={isMobileView ? endPress : undefined} // For mobile touch
    >
      <div className="w-full p-2 flex items-center gap-3 cursor-pointer">
        <UserAvatar user={user} size="sm" showStatus={false} />
        <div className="flex-1 min-w-0 text-left pr-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm truncate">
              {user?.username}
            </span>
            {time && (
              <span className="text-xs text-muted-foreground shrink-0">
                {time}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground truncate">{message}</p>
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 flex items-center justify-center shrink-0"
              >
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Delete menu (mobile only) */}
      {isMobileView && isLongPress && (
        <div
          className="absolute inset-0 bg-background/90 rounded-lg backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-background border border-muted rounded-lg p-3 shadow-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Delete this conversation?
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop dropdown menu (hidden on mobile) */}
      {!isMobileView && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
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
                handleDeleteConversation(conversationId);
              }}
            >
              Delete Conversation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

// Message Component
const Message = ({ content, timestamp, isOwn, sender }) => (
  <div
    className={`flex items-start gap-2 ${
      isOwn ? "flex-row-reverse" : "flex-row"
    }`}
  >
    <UserAvatar user={sender} size="sm" className="mt-1" />
    <div
      className={`max-w-[75%] px-3 py-2 rounded-lg ${
        isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`text-xs font-medium ${
            isOwn ? "text-primary-foreground/80" : "text-foreground/80"
          }`}
        >
          {isOwn ? "You" : sender?.username}
        </span>
        <span
          className={`text-xs ${
            isOwn ? "text-primary-foreground/60" : "text-muted-foreground"
          }`}
        >
          {timestamp}
        </span>
      </div>
      <p className="text-sm break-words">{content}</p>
    </div>
  </div>
);

export default Inbox;
