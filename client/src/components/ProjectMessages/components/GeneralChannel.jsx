import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "date-fns";
import {  Send, Paperclip, Loader } from "lucide-react";
import { CHANNEL_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useSocketContext } from "../../../../context/SocketContext";

const GeneralChannel = ({ channel }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const { socket } = useSocketContext();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
  }, [channel._id]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join_channel", channel._id);

    const handleNewMessage = (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [channel._id, socket]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${CHANNEL_API_END_POINT}/messages/${channel._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages(response.data.messages);
        scrollToBottom();
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSending(true);
      const response = await axios.post(
        `${CHANNEL_API_END_POINT}/message`,
        {
          channelId: channel._id,
          content: newMessage,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Add the new message to local state immediately
        setMessages((prev) => [...prev, response.data.message]);
        setNewMessage("");
        scrollToBottom(); // Scroll to show new message
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const Message = ({ message, isOwn }) => (
    <div
      className={`flex items-start gap-3 mb-4 ${
        isOwn ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.sender?.profile?.profilePhoto} />
        <AvatarFallback>
          {message.sender?.username?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div
        className={`max-w-[70%] ${
          isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
        } rounded-lg p-3`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {message.sender?.username}
          </span>
          <span className="text-xs opacity-70">
            {format(new Date(message.createdAt), "h:mm a")}
          </span>
        </div>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <Message
              key={message._id}
              message={message}
              isOwn={message.sender._id === user._id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            type="submit"
            className="shrink-0"
            disabled={sending || !newMessage.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralChannel;
