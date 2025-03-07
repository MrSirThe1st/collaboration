import { Clock, X, Check, Trash2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { INVITATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./ui/tooltip";
import { setAllSentInvitations } from "@/redux/projectSlice";
import { toast } from "sonner";

const InvitationSentCard = () => {
  const dispatch = useDispatch();
  const { allSentInvitations = [] } = useSelector((store) => store.project);

  const handleDeleteInvitation = async (invitationId) => {
    try {
      // Make API call to delete invitation
      const response = await axios.delete(
        `${INVITATION_API_END_POINT}/${invitationId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update Redux state by filtering out the deleted invitation
        const updatedInvitations = allSentInvitations.filter(
          (invitation) => invitation._id !== invitationId
        );
        dispatch(setAllSentInvitations(updatedInvitations));
        toast.success("Invitation deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting invitation:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete invitation"
      );
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return (
          <Tooltip>
            <TooltipTrigger>
              <Clock className="text-gray-400 h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Pending</TooltipContent>
          </Tooltip>
        );
      case "declined":
        return (
          <Tooltip>
            <TooltipTrigger>
              <X className="text-red-500 h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>Declined</TooltipContent>
          </Tooltip>
        );
      case "accepted":
        return (
          <Tooltip>
            <TooltipTrigger>
              <Check className="text-green-500 h-4 w-4" />
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
      <div className="space-y-3 sm:space-y-4">
        {allSentInvitations.length <= 0 ? (
          <span className="text-muted-foreground">
            You have not sent any invitation yet.
          </span>
        ) : (
          allSentInvitations.map((sentInvitation) => (
            <div
              key={sentInvitation._id}
              className="p-3 sm:p-4 border rounded-md flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0"
            >
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium">
                  {sentInvitation.project?.title || "N/A"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Sent to: {sentInvitation.recipient?.username || "N/A"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {sentInvitation?.createdAt?.split("T")[0]}
                </span>
              </div>

              <div className="flex items-center justify-end sm:justify-center space-x-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {getStatusIcon(sentInvitation.status)}
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteInvitation(sentInvitation._id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Invitation</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))
        )}
      </div>
    </TooltipProvider>
  );
};

export default InvitationSentCard;
