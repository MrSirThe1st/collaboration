// ProjectMessageArea.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { PROJECT_MESSAGE_API_END_POINT } from "@/utils/constant";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  addAnnouncement,
  setAnnouncements,
  setError,
  setLoading,
} from "@/redux/projectMessagesSlice";

const ProjectMessageArea = ({ projectId }) => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const project = useSelector((state) => state.project.singleProject);
  const announcements = useSelector(
    (state) => state.projectMessages?.announcements ?? []
  );

  const isProjectOwner = project?.created_by === user?._id;

  // Fetch announcements when component mounts
  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!projectId) return;

      dispatch(setLoading(true));
      try {
        const response = await axios.get(
          `${PROJECT_MESSAGE_API_END_POINT}/announcements/${projectId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(setAnnouncements(response.data.announcements));
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        dispatch(setError("Failed to fetch announcements"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAnnouncements();
  }, [projectId, dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await axios.post(
        `${PROJECT_MESSAGE_API_END_POINT}/announcement/${projectId}`,
        { content: message },
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(addAnnouncement(response.data.message));
        setMessage("");
      }
    } catch (error) {
      console.error("Error sending announcement:", error);
      dispatch(
        setError(error.response?.data?.message || "Failed to send announcement")
      );
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {announcements.map((msg) => (
          <div
            key={msg._id}
            className="flex gap-3 p-4 rounded-lg border bg-card"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={msg.sender.profile?.profilePhoto} />
              <AvatarFallback>
                {msg.sender.username?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {msg.sender.username}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {isProjectOwner && (
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send an announcement..."
              className="flex-1"
            />
            <Button type="submit" disabled={!message.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProjectMessageArea;
