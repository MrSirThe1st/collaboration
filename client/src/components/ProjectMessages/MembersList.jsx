import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {

  Plus,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



const MembersList = ({ members }) => {
  const groupedMembers = members?.reduce((acc, member) => {
    const role = member.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(member);
    return acc;
  }, {});

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
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.profile?.profilePhoto} />
                    <AvatarFallback>
                      {member.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
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
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Remove from Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button className="w-full mt-4">
        <Plus className="mr-2 h-4 w-4" />
        Invite Member
      </Button>
    </div>
  );
};


export default MembersList