import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import axios from "axios";
import {
  setMessages,
  addMessage,
  updateMessage,
  setCurrentThread,
  saveDraft,
  setEditingMessageId,
} from "@/redux/messageSlice";
import { MESSAGES_API_END_POINT } from "@/utils/constant";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusCircle,
  Smile,
  Paperclip,
  Send,
  MoreVertical,
  Reply,
  Edit,
  Trash2,
  Image as ImageIcon,
  X,
  MessageSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { io } from "socket.io-client";

const MessagesArea = ({ channel }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages?.messages ?? []);
  const currentThread = useSelector((state) => state.messages?.currentThread);
  const editingMessageId = useSelector(
    (state) => state.messages?.editingMessageId
  );
  const fileUploads = useSelector((state) => state.messages?.fileUploads ?? []);
  const user = useSelector((state) => state.auth.user);

  const [message, setMessage] = useState("");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const loadMessages = async () => {
    try {
      let endpoint;
      switch (channel._id) {
        case "general":
          endpoint = `${MESSAGES_API_END_POINT}/general`;
          break;
        case "announcements":
          endpoint = `${MESSAGES_API_END_POINT}/announcements`;
          break;
        default:
          endpoint = `${MESSAGES_API_END_POINT}/channel/${channel._id}`;
      }

      const response = await axios.get(endpoint, { withCredentials: true });

      if (response.data.success) {
        dispatch(setMessages(response.data.messages));
        scrollToBottom();
      } else {
        console.error("Failed to load messages:", response.data);
        toast.error("Failed to load messages");
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      toast.error("Error loading messages");
    }
  };

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(import.meta.env.VITE_API_URL, {
      query: { userId: user._id },
      withCredentials: true,
    });

    // Listen for new messages
    socket.current.on("new_message", (newMessage) => {
      if (newMessage.channelId === channel._id) {
        dispatch(addMessage(newMessage));
        scrollToBottom();
      }
    });

    // Listen for message updates
    socket.current.on("message_update", (updatedMessage) => {
      dispatch(updateMessage(updatedMessage));
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [channel._id, user._id]);

   useEffect(() => {
     scrollToBottom();
   }, [messages]);

  useEffect(() => {
    loadMessages();
    const draft = localStorage.getItem(`draft_${channel._id}`);
    if (draft) setMessage(draft);
  }, [channel._id]);



  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    try {
      // Create message data
      const messageData = {
        content: message.trim(), // Make sure to trim the message
        type: "text",
      };

      if (attachments.length > 0) {
        // If there are attachments, use FormData
        const formData = new FormData();
        formData.append("content", message.trim());

        attachments.forEach((file) => {
          formData.append("attachments", file);
        });

        const response = await axios.post(
          `${MESSAGES_API_END_POINT}/send/${channel._id}`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.success) {
          setMessage("");
          setAttachments([]);
          setReplyingTo(null);
          localStorage.removeItem(`draft_${channel._id}`);
          toast.success("Message sent successfully");
        }
      } else {
        // If no attachments, send as JSON
        const response = await axios.post(
          `${MESSAGES_API_END_POINT}/send/${channel._id}`,
          messageData,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.data.success) {
          setMessage("");
          setReplyingTo(null);
          localStorage.removeItem(`draft_${channel._id}`);
          toast.success("Message sent successfully");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleEditMessage = async (messageId, newContent) => {
    try {
      const response = await axios.put(
        `${MESSAGES_API_END_POINT}/${messageId}`,
        { content: newContent },
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(updateMessage(response.data.message));
        dispatch(setEditingMessageId(null));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to edit message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`${MESSAGES_API_END_POINT}/${messageId}`, {
        withCredentials: true,
      });

      dispatch(deleteMessage(messageId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleThreadClick = (message) => {
    dispatch(setCurrentThread(message));
  };

  // Render message with its replies if any
  const MessageItem = ({ message }) => (
    <div className="group relative flex gap-3 px-4 py-2 hover:bg-muted/50">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={message.sender.profile?.profilePhoto} />
        <AvatarFallback>
          {message.sender.username?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            {message.sender.username}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
          {message.isEdited && (
            <span className="text-xs text-muted-foreground">(edited)</span>
          )}
        </div>

        {editingMessageId === message._id ? (
          <Input
            value={message.content}
            onChange={(e) => handleEditMessage(message._id, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditMessage(message._id, e.target.value);
              }
            }}
            className="mt-1"
          />
        ) : (
          <>
            <p className="text-sm mt-1">{message.content}</p>
            {message.attachments?.map((attachment, index) => (
              <div key={index} className="mt-2">
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt="attachment"
                    className="max-w-lg rounded-lg cursor-pointer"
                    onClick={() => {
                      setSelectedImage(attachment.url);
                      setShowImagePreview(true);
                    }}
                  />
                ) : (
                  <a
                    href={attachment.url}
                    download
                    className="text-sm text-blue-500 hover:underline"
                  >
                    {attachment.filename}
                  </a>
                )}
              </div>
            ))}
          </>
        )}

        {message.replies?.length > 0 && (
          <button
            onClick={() => handleThreadClick(message)}
            className="mt-2 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
          >
            <MessageSquare className="h-3 w-3" />
            {message.replies.length} replies
          </button>
        )}
      </div>

      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setReplyingTo(message)}
        >
          <Reply className="h-4 w-4" />
        </Button>
        {message.sender._id === user._id && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => dispatch(setEditingMessageId(message._id))}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleDeleteMessage(message._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-1">
            {messages.map((msg) => (
              <MessageItem key={msg._id} message={msg} />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-4 py-2 border-t bg-muted/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Reply className="h-4 w-4" />
              <span>
                Replying to{" "}
                <span className="font-medium">
                  {replyingTo.sender.username}
                </span>
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setReplyingTo(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="px-4 py-2 border-t">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="relative group bg-muted rounded-md p-2 flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  <span className="text-sm truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              multiple
            />
            <Input
              placeholder={`Message ${channel.name}`}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                localStorage.setItem(`draft_${channel._id}`, e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() && attachments.length === 0}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Thread view */}
      {currentThread && (
        <div className="w-96 border-l flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Thread</h3>
          </div>
          <ScrollArea className="flex-1">
            <MessageItem message={currentThread} />
            <div className="pl-8">
              {currentThread.replies?.map((reply) => (
                <MessageItem key={reply._id} message={reply} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Image preview dialog */}
      <Dialog open={showImagePreview} onOpenChange={setShowImagePreview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesArea;
