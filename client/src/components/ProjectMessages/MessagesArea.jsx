import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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

const MessageArea = ({ channel }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // This will be replaced with Redux state
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() && !selectedImage) return;

    // Add message to the list (this will be replaced with API call)
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: message,
        image: selectedImage,
        sender: {
          id: "currentUser",
          name: "John Doe",
          avatar: "/placeholder-avatar.jpg",
        },
        timestamp: new Date(),
      },
    ]);

    setMessage("");
    setSelectedImage(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setShowImagePreview(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const MessageItem = ({ message }) => (
    <div className="group flex items-start gap-3 px-4 py-2 hover:bg-muted/50">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={message.sender.avatar} />
        <AvatarFallback>
          {message.sender.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{message.sender.name}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Reply className="h-4 w-4 mr-2" />
                  Reply
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm">{message.content}</p>
        {message.image && (
          <img
            src={message.image}
            alt="Message attachment"
            className="mt-2 max-w-lg rounded-lg cursor-pointer"
            onClick={() => {
              setSelectedImage(message.image);
              setShowImagePreview(true);
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-1">
          {messages.map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t">
        {selectedImage && (
          <div className="mb-4 relative inline-block">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-32 rounded-lg"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1 right-1 bg-background/50 hover:bg-background/75"
              onClick={() => setSelectedImage(null)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <form onSubmit={handleSendMessage}>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <PlusCircle className="h-5 w-5" />
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder={`Message ${channel.name}`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>

      {/* Image Preview Dialog */}
      <Dialog
        open={showImagePreview}
        onOpenChange={(open) => setShowImagePreview(open)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size preview"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessageArea;
