import React from "react";
import { Clock, X, Check } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip"; 

const InvitationSentCard = () => {
  const { allSentInvitations = [] } = useSelector((store) => store.project);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return (
          <Tooltip>
            <TooltipTrigger>
              <Clock className="text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>Pending</TooltipContent>
          </Tooltip>
        );
      case "rejected":
        return (
          <Tooltip>
            <TooltipTrigger>
              <X className="text-red-500" />
            </TooltipTrigger>
            <TooltipContent>Rejected</TooltipContent>
          </Tooltip>
        );
      case "accepted":
        return (
          <Tooltip>
            <TooltipTrigger>
              <Check className="text-green-500" />
            </TooltipTrigger>
            <TooltipContent>Accepted</TooltipContent>
          </Tooltip>
        );
      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {allSentInvitations.length <= 0 ? (
          <span>You haven't sent any invitation yet.</span>
        ) : (
          allSentInvitations.map((sentInvitation) => (
            <div
              key={sentInvitation._id}
              className="p-4 bg-white shadow-sm rounded-md flex justify-between items-center space-x-4"
            >
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium text-gray-900">
                  {sentInvitation.project?.title || "N/A"}
                </span>
                <span className="text-xs text-gray-500">
                  Sent to: {sentInvitation.recipient?.username || "N/A"}
                </span>
                <span className="text-xs text-gray-400">
                  {sentInvitation?.createdAt?.split("T")[0]}
                </span>
              </div>
              <div className="text-lg">
                {getStatusIcon(sentInvitation.status)}
              </div>
            </div>
          ))
        )}
      </div>
    </TooltipProvider>
  );
};

export default InvitationSentCard;
