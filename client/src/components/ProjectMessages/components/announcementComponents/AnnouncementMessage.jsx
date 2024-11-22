import React from "react";
import { Bell, Pin, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector } from "react-redux";

const AnnouncementMessage = ({ announcement, onPin, onDelete, onEdit }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthor = user?._id === announcement.sender._id;

  return (
    <div className="relative bg-primary/5 rounded-lg p-4 mb-4">
      {/* Pin indicator */}
      {announcement.isPinned && (
        <div className="absolute -top-2 -right-2">
          <Pin className="h-4 w-4 text-primary" />
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Icon and author info */}
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-full">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={announcement.sender.profile?.profilePhoto} />
            <AvatarFallback>
              {announcement.sender.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {announcement.sender.username}
              </span>
              <Badge variant="secondary">Announcement</Badge>
              {announcement.isPinned && (
                <Badge variant="outline" className="text-primary">
                  Pinned
                </Badge>
              )}
            </div>

            {/* Actions dropdown for author */}
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <span className="sr-only">Actions</span>
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPin(announcement)}>
                    {announcement.isPinned ? "Unpin" : "Pin"} Announcement
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(announcement)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDelete(announcement)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Announcement content */}
          <p className="mt-2 text-sm">{announcement.content}</p>

          {/* Attachments */}
          {announcement.attachments?.length > 0 && (
            <div className="mt-3 space-y-2">
              {announcement.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary hover:underline"
                  >
                    {attachment.filename}
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Posted {new Date(announcement.createdAt).toLocaleDateString()}
            </span>
            {announcement.editHistory?.length > 0 && <span>(edited)</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementMessage;
