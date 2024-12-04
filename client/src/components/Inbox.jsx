import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  MessageCircle,
  Search,
  Settings,
  VideoIcon,
  Phone,
  MoreVertical,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { INBOX_API_END_POINT } from "@/utils/constant";
import {
  setConversations,
  setCurrentChat,
  setMessages,
  addMessage,
  setLoading,
  setError,
} from "../redux/inboxSlice";

const Inbox = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const dispatch = useDispatch();
  const { conversations, currentChat, messages, loading, error, unreadCounts } =
    useSelector((state) => state.inbox);
  const [messageInput, setMessageInput] = useState("");
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  const { userId, username, startChat } = location.state || {};
  

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
        console.log("Conversations response:", response.data); 
        if (response.data.success) {
          dispatch(setConversations(response.data.conversations));
        }
      } catch (error) {
        console.error("Full error:", error);
        dispatch(setError(error.message));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchConversations();
  }, [dispatch]);

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
  }, [currentChat, dispatch]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentChat) return;

    try {
      const response = await axios.post(
        `${INBOX_API_END_POINT}/send`,
        {
          recipientId: currentChat._id,
          content: messageInput.trim(),
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(addMessage(response.data.message));
        setMessageInput("");

        // Fetch updated conversations list
        const conversationsResponse = await axios.get(
          `${INBOX_API_END_POINT}/conversations`,
          { withCredentials: true }
        );

        if (conversationsResponse.data.success) {
          dispatch(setConversations(conversationsResponse.data.conversations));
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  // Handle selecting a conversation
  const handleSelectChat = async (user) => {
    // Clear the messages state immediately
    dispatch(setMessages([]));

    // Set the current chat details
    dispatch(
      setCurrentChat({
        _id: user._id,
        username: user.username,
        profile: user.profile,
      })
    );

    // Delay fetching new messages until the current chat updates
    setTimeout(async () => {
      const existingConversation = conversations.find((conv) =>
        conv.participants.some((p) => p._id === user._id)
      );

      if (existingConversation) {
        try {
          const response = await axios.get(
            `${INBOX_API_END_POINT}/conversation/${user._id}`,
            { withCredentials: true }
          );
          if (response.data.success) {
            dispatch(setMessages(response.data.messages));
          }
        } catch (error) {
          toast.error("Failed to load conversation");
        }
      }
    }, 0);
  };


  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (startChat && userId) {
      dispatch(setMessages([]));
      dispatch(setCurrentChat(null)); 

      dispatch(
        setCurrentChat({
          _id: userId,
          username: username,
          profilePhoto: location.state?.profilePhoto,
        })
      );

      if (!location.state?.existingChat) {
        return;
      }
    }
  }, [userId, startChat]);

  return (
    <div className="flex h-screen bg-background">
      {/* Conversations Sidebar */}
      <div className="w-60 border-r flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Messages</h2>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {conversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(
                (p) => p._id !== user._id
              );

              return (
                <ConversationItem
                  key={conversation._id}
                  avatar={otherParticipant?.profile?.profilePhoto}
                  name={otherParticipant?.username}
                  message={
                    conversation.lastMessage?.content || "No messages yet"
                  }
                  time={formatTimestamp(conversation.lastMessage?.createdAt)}
                  unread={0} // We'll implement this later
                  isSelected={currentChat?._id === otherParticipant?._id}
                  onClick={() => handleSelectChat(otherParticipant)}
                />
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {currentChat ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat Header */}
          <div className="h-16 border-b flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={
                    currentChat.profilePhoto ||
                    currentChat.profile?.profilePhoto
                  }
                />
                <AvatarFallback>
                  {currentChat.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{currentChat.username}</h3>
                <span className="text-sm text-muted-foreground">Online</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <Message
                  key={message._id}
                  content={message.content}
                  timestamp={formatTimestamp(message.createdAt)}
                  isOwn={message.sender._id === user._id}
                  avatar={message.sender.profile?.profilePhoto}
                />
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
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
              />
              <Button
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No Conversation Selected</h3>
            <p className="text-sm text-muted-foreground">
              Choose a conversation from the sidebar to start messaging
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// Conversation Item Component
const ConversationItem = ({
  avatar,
  name,
  message,
  time,
  unread,
  isSelected,
  onClick,
}) => (
  <button
    className={`w-full p-3 rounded-lg flex items-center gap-3 hover:bg-accent transition-colors ${
      isSelected ? "bg-accent" : ""
    }`}
    onClick={onClick}
  >
    <Avatar>
      <AvatarImage src={avatar} />
      <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
    </Avatar>
    <div className="flex-1 min-w-0 text-left">
      <div className="flex items-center justify-between">
        <span className="font-medium">{name}</span>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground truncate">{message}</p>
        {unread > 0 && (
          <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unread}
          </span>
        )}
      </div>
    </div>
  </button>
);

// Message Component
const Message = ({ content, timestamp, isOwn, avatar }) => (
  <div
    className={`flex items-start gap-3 ${
      isOwn ? "flex-row-reverse" : "flex-row"
    }`}
  >
    {!isOwn && (
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )}
    <div
      className={`max-w-[70%] ${
        isOwn ? "bg-primary text-primary-foreground" : "bg-accent"
      } rounded-lg p-3`}
    >
      <p>{content}</p>
      <span className="text-xs mt-1 block opacity-70">{timestamp}</span>
    </div>
  </div>
);

export default Inbox;
