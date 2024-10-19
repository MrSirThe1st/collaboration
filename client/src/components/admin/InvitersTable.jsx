import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { X, Check, MoreHorizontal, Info } from "lucide-react";
import { Button } from "../ui/button";
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
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { setAllSenders } from "@/redux/invitationSlice";
import {
  INVITATION_API_END_POINT,
  PROJECT_API_END_POINT,
} from "@/utils/constant";

const ProjectInvitations = () => {
  const dispatch = useDispatch();
  const { senders } = useSelector((store) => store.invitation);
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleInvitationAction = async (action, invitation) => {
    try {
      axios.defaults.withCredentials = true;

      const res = await axios.post(
        `${INVITATION_API_END_POINT}/${invitation._id}/status`,
        { status: action.toLowerCase() }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        if (action === "Accepted") {
          await assignMemberToProject(
            invitation.project._id,
            invitation.recipient,
            invitation.role
          );
        }

        const updatedInvitations = await axios.get(
          `${INVITATION_API_END_POINT}/received`
        );
        dispatch(setAllSenders(updatedInvitations.data.invitations));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.error("Full error object:", error);
    }
    setSelectedInvitation(null);
  };

  const assignMemberToProject = async (projectId, memberId, role) => {
    try {
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
      toast.error(
        error.response?.data?.message || "Failed to add member to project"
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Mapping through invitations to create a card layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {senders && senders.length > 0 ? (
          senders.map((invitation) =>
            invitation.project ? (
              <Popover key={invitation._id}>
                <PopoverTrigger asChild>
                  <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-4 cursor-pointer hover:bg-gray-50">
                    {/* Project Logo */}
                    <div className="flex-shrink-0">
                      {invitation.project.logo ? (
                        <img
                          src={invitation.project.logo}
                          alt={invitation.project.title}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500">Logo</span>
                        </div>
                      )}
                    </div>
                    {/* Invitation details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">
                        {invitation.inviter.username}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Invited you to join the project:{" "}
                        <strong>{invitation.project.title}</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        Role: {invitation.role}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {/* Status and action icons */}
                    <div className="flex-shrink-0">
                      {invitation.status === "pending" && (
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Project Invitation</h3>
                    <p>
                      <strong>{invitation.inviter.username}</strong> you have been invited
                      to join the project:{" "}
                      <strong>{invitation.project.title}</strong>
                    </p>
                    <p>Role: {invitation.role}</p>
                    <p>{invitation.message}</p>
                    <p className="text-sm text-gray-500">
                      Received on:{" "}
                      {new Date(invitation.createdAt).toLocaleString()}
                    </p>
                    {invitation.status === "pending" && (
                      <div className="flex space-x-2 mt-4">
                        <Button
                          onClick={() =>
                            handleInvitationAction("Accepted", invitation)
                          }
                          className="flex-1"
                        >
                          <Check className="mr-2 h-4 w-4" /> Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleInvitationAction("Rejected", invitation)
                          }
                          className="flex-1"
                        >
                          <X className="mr-2 h-4 w-4" /> Decline
                        </Button>
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedInvitation(invitation);
                        setIsSheetOpen(true);
                      }}
                      className="w-full mt-2"
                    >
                      <Info className="mr-2 h-4 w-4" />
                      View Project Info
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <p key={invitation._id} className="text-gray-500 text-center">
                Invitation is missing project details.
              </p>
            )
          )
        ) : (
          <p className="text-gray-500 text-center">No invitations available.</p>
        )}
      </div>

      {/* Shadcn UI Sheet for project info */}
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
            {/* Add other details as needed */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProjectInvitations;
