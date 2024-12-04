import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "date-fns";
import { Hash, Send, Paperclip, Users } from "lucide-react";
import { CHANNEL_API_END_POINT } from "@/utils/constant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useSocketContext } from "../../../../context/SocketContext";
import store from "@/redux/store";

const RoleBasedChannel = ({ channel }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
    try {
      setLoading(true);
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
      setLoading(false);
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
        setNewMessage("");
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
          <Badge variant="secondary" className="text-xs">
            {message.sender?.role || channel.role}
          </Badge>
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
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            <h2 className="font-semibold text-lg">{channel.name}</h2>
            <Badge variant="outline">{channel.role}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {channel.members?.length} members
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Private channel for {channel.role} team members
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation with your team!</p>
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
            placeholder={`Message #${channel.name}`}
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

export default RoleBasedChannel;
