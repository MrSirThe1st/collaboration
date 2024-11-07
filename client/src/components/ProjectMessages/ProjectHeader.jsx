import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Users,
  Bell,
  Search,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ProjectHeader = ({ project }) => {
  return (
    <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-2">
        <Menu className="h-5 w-5 md:hidden" />
        <h1 className="font-semibold text-lg">{project?.title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="pl-9 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          />
        </div>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={project?.logo} />
              <AvatarFallback>{project?.title?.slice(0, 2)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default ProjectHeader;
