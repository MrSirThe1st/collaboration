// MessageButton.jsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { setMessages } from "@/redux/inboxSlice";
import { useDispatch } from "react-redux";
import { resetInbox } from "@/redux/inboxSlice";

const MessageButton = ({ userId, username, profile }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleMessageClick = () => {
    dispatch(resetInbox()); 
    navigate("/inbox", {
      state: {
        userId,
        username,
        profilePhoto: profile?.profilePhoto,
        startChat: true,
        existingChat: false,
      },
    });
  };

  return (
    <Button onClick={handleMessageClick} variant="secondary" size="sm">
      <MessageCircle className="h-4 w-4 mr-2" />
      Message
    </Button>
  );
};

export default MessageButton;
