import { useState } from "react";
import { Send } from "lucide-react";
import useSendMessage from "@/hooks/useSendMessage";
import { useSelector } from "react-redux"; // Import useSelector

const MessageInput = ({ memberId }) => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();

  // Get the current user's ID from the Redux store
  const currentUser = useSelector((state) => state.auth.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message || !currentUser || !memberId) return;

    // Call sendMessage with both senderId (currentUser._id) and receiverId (memberId)
    await sendMessage({
      message,
      senderId: currentUser._id,
      receiverId: memberId,
    });
    setMessage("");
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 end-0 flex items-center pe-3"
        >
          {loading ? <div className="loading loading-spinner"></div> : <Send />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
