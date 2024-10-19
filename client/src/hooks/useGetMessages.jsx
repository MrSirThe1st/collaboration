import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "../redux/conversationSlice";
import { toast } from "sonner";
import axios from "axios";
import { MESSAGES_API_END_POINT } from "@/utils/constant";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);

  const selectedConversation = useSelector(
    (state) => state.conversation.selectedConversation
  );
  const messages = useSelector((state) => state.conversation.messages);

  const dispatch = useDispatch();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${MESSAGES_API_END_POINT}/${selectedConversation._id}`,
          {
            withCredentials: true, 
          }
        );

        if (res.data.error) throw new Error(res.data.error);

        dispatch(setMessages(res.data));
      } catch (error) {
        toast.error(error.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, dispatch]);

  return { messages, loading };
};

export default useGetMessages;
