import React from "react";
import { useLocation } from "react-router-dom";
import Messages from "./Messages";
import MessageInput from "./MessageInput";

const MessageContainer = () => {
  const location = useLocation();
  const member = location.state?.member;

  if (!member) {
    return <div>Loading...</div>;
  }

  return (
    <div className="message-container p-4">
      <div className="bg-slate-500 px-4 py-2 mb-2">
        <span className="label-text text-white">To:</span>{" "}
        <span className="text-gray-900 font-bold">{member.username}</span>
      </div>
      <Messages memberId={member._id} />
      <MessageInput memberId={member._id} />
    </div>
  );
};

export default MessageContainer;
