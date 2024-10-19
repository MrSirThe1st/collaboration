import { useEffect } from "react";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { setMessages } from "@/redux/conversationSlice"; 
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const dispatch = useDispatch();


  const messages = useSelector((state) => state.conversation.messages);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
      dispatch(setMessages([...messages, newMessage]));
    };

    socket?.on("newMessage", handleNewMessage);

    return () => {
      socket?.off("newMessage", handleNewMessage);
    };
  }, [socket, messages, dispatch]);
};

export default useListenMessages;
