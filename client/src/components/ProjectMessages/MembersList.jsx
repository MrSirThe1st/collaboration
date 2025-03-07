import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { resetInbox } from "@/redux/inboxSlice";
import UserAvatar from "../customUI/UserAvatar";

const MembersList = ({ members, onClose }) => {
  const groupedMembers = members?.reduce((acc, member) => {
    const role = member.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const project = useSelector((state) => state.project.singleProject);
  const user = useSelector((state) => state.auth.user);

  const isProjectOwner = project?.created_by === user?._id;

  const handleMessageClick = (member) => {
    dispatch(resetInbox());
    if (onClose) onClose(); // Close the members list sidebar first
    setTimeout(() => {
      // Add a small delay before navigation
      navigate("/inbox", {
        state: {
          userId: member._id,
          username: member.username,
          profilePhoto: member.profile?.profilePhoto,
          startChat: true,
          existingChat: false,
        },
        replace: true,
      });
    }, 100);
  };

  const handleViewProfile = (member) => {
    console.log("Member data:", member);
    if (onClose) onClose();

    // Format the member data to match what UserDetail expects
    const formattedUser = {
      _id: member.id || member._id,
      username: member.username,
      email: member.email,
      profession: member.profession,
      status: member.status,
      profile: {
        profilePhoto: member.profile?.profilePhoto,
        bio: member.profile?.bio,
        skills: member.profile?.skills || [],
        socialLinks: member.profile?.socialLinks || {},
        ...member.profile,
      },
    };

    setTimeout(() => {
      navigate(`/user/${formattedUser._id}`, {
        state: { user: formattedUser },
      });
    }, 100);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Team Members</h2>
        <span className="text-sm text-muted-foreground">
          {members?.length} members
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedMembers || {}).map(([role, roleMembers]) => (
          <div key={role}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              {role} ({roleMembers.length})
            </h3>
            <div className="space-y-2">
              {roleMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <UserAvatar
                    user={member} 
                    size="sm" 
                    showStatus 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {member.status || "Available"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewProfile(member)}
                      >
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleMessageClick(member)}
                      >
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {isProjectOwner && (
                        <DropdownMenuItem className="text-red-600">
                          Remove from Project
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* <Button className="w-full mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Invite Member
      </Button> */}
    </div>
  );
};

export default MembersList;