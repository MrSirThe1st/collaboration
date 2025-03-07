import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { X, Check, MoreHorizontal, Info, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  setAllSenders,
  markAllInvitationsAsRead,
} from "@/redux/invitationSlice";
import {
  INVITATION_API_END_POINT,
  PROJECT_API_END_POINT,
} from "@/utils/constant";

const ProjectInvitations = () => {
  const dispatch = useDispatch();
  const { senders } = useSelector((store) => store.invitation);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await axios.get(
          `${INVITATION_API_END_POINT}/received`,
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          dispatch(setAllSenders(response.data.invitations));
        }
      } catch (error) {
        toast.error("Failed to fetch invitations");
      }
    };

    fetchInvitations();
  }, [dispatch]);

  useEffect(() => {
    dispatch(markAllInvitationsAsRead());
  }, [dispatch]);

  const handleInvitationAction = async (action, invitation) => {
    try {
      // Set axios to include credentials
      axios.defaults.withCredentials = true;

      // Send the request with the correct status value (lowercase)
      const res = await axios.post(
        `${INVITATION_API_END_POINT}/${invitation._id}/status`,
        { status: action.toLowerCase() },
        { withCredentials: true } // Explicitly set withCredentials here as well
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // If the invitation was accepted, assign the member to the project
        if (action.toLowerCase() === "accepted") {
          await assignMemberToProject(
            invitation.project._id,
            invitation.recipient,
            invitation.role
          );
        }

        // Refresh the invitations list
        const updatedInvitations = await axios.get(
          `${INVITATION_API_END_POINT}/received`,
          { withCredentials: true }
        );
        dispatch(setAllSenders(updatedInvitations.data.invitations));
      }
    } catch (error) {
      console.error("Full error details:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${action.toLowerCase()} invitation. Please try again.`
      );
    }
    setSelectedInvitation(null);
  };

  const assignMemberToProject = async (projectId, memberId, role) => {
    try {
      console.log("Sending request with:", { projectId, memberId, role });

      const response = await axios.post(
        `${PROJECT_API_END_POINT}/assign-member`,
        { projectId, memberId, role },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("You have been added to the project successfully.");
      } else {
        toast.error(response.data.message || "Failed to add member to project");
      }
    } catch (error) {
      console.error("Error assigning member to project:", error);
      console.error("Request payload:", { projectId, memberId, role });
      toast.error(
        error.response?.data?.message || "Failed to add member to project"
      );
    }
  };

  const handleDeleteInvitation = async (invitation) => {
    try {
      const response = await axios.delete(
        `${INVITATION_API_END_POINT}/${invitation._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedInvitations = senders.filter(
          (inv) => inv._id !== invitation._id
        );
        dispatch(setAllSenders(updatedInvitations));
        toast.success("Invitation deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting invitation:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete invitation"
      );
    } finally {
      setShowDeleteDialog(false);
      setInvitationToDelete(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {senders && senders.length > 0 ? (
          senders.map((invitation) =>
            invitation.project ? (
              <Popover key={invitation._id}>
                <PopoverTrigger asChild>
                  <div className="bg-transparent border border-border rounded-lg p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 cursor-pointer hover:bg-muted/5 transition-colors">
                    {/* Project Logo with Placeholder */}
                    <div className="flex-shrink-0">
                      {invitation.project.logo ? (
                        <img
                          src={invitation.project.logo}
                          alt={invitation.project.title}
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-muted flex items-center justify-center bg-muted/10">
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {invitation.project.title
                              ?.charAt(0)
                              ?.toUpperCase() || "P"}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Invitation details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold truncate">
                        {invitation.inviter.username}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Invited you to join the project:{" "}
                        <strong className="text-foreground">
                          {invitation.project.title}
                        </strong>
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Role:{" "}
                        <span className="text-foreground">
                          {invitation.role}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Status and action icons */}
                    <div className="flex-shrink-0 self-end sm:self-center">
                      {invitation.status === "pending" && (
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full max-w-[320px] md:max-w-[350px] p-3 md:p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm md:text-base">
                      Project Invitation
                    </h3>
                    <p className="text-xs md:text-sm">
                      <strong>{invitation.inviter.username}</strong> you have
                      been invited to join the project:{" "}
                      <strong>{invitation.project.title}</strong>
                    </p>
                    <p className="text-xs md:text-sm">
                      Role: {invitation.role}
                    </p>
                    <p className="text-xs md:text-sm line-clamp-3">
                      {invitation.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      Received on:{" "}
                      {new Date(invitation.createdAt).toLocaleString()}
                    </p>

                    {invitation.status === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 mt-3">
                        <Button
                          onClick={() =>
                            handleInvitationAction("accepted", invitation)
                          }
                          className="w-full text-xs md:text-sm"
                          size="sm"
                        >
                          <Check className="mr-2 h-3 w-3 md:h-4 md:w-4" />{" "}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleInvitationAction("declined", invitation)
                          }
                          className="w-full text-xs md:text-sm"
                          size="sm"
                        >
                          <X className="mr-2 h-3 w-3 md:h-4 md:w-4" /> Decline
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedInvitation(invitation);
                          setIsSheetOpen(true);
                        }}
                        className="w-full text-xs md:text-sm"
                        size="sm"
                      >
                        <Info className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                        View Project Info
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setInvitationToDelete(invitation);
                          setShowDeleteDialog(true);
                        }}
                        className="w-full text-xs md:text-sm"
                        size="sm"
                      >
                        <Trash2 className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <p
                key={invitation._id}
                className="text-muted-foreground text-center"
              >
                Invitation is missing project details.
              </p>
            )
          )
        ) : (
          <p className="text-muted-foreground text-center col-span-full">
            No invitations available.
          </p>
        )}
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedInvitation?.project.title}</SheetTitle>
            <SheetDescription>
              {selectedInvitation?.project.description}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-2 mt-4">
            <p>
              <strong>Requirements:</strong>{" "}
              {selectedInvitation?.project.requirements.join(", ")}
            </p>
          </div>
        </SheetContent>
      </Sheet>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invitation? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteInvitation(invitationToDelete)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectInvitations;
