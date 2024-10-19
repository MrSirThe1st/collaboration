import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "@/redux/conversationSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { MESSAGES_API_END_POINT } from "@/utils/constant";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const messages = useSelector((state) => state.conversation.messages);

  const sendMessage = async ({ message, senderId, receiverId }) => {
    setLoading(true);
    try {
      // Sending the message to the backend API with both senderId and receiverId
      const { data } = await axios.post(
        `${MESSAGES_API_END_POINT}/send/${receiverId}`,
        { message, senderId },
        { withCredentials: true }
      );

      // Update the messages in the Redux store
      dispatch(setMessages([...messages, data]));
    } catch (error) {
      toast.error(error.response?.data?.error || "Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
