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
  Plus,
  Hash,
  ChevronDown,
  Lock,
  Globe,
  Volume2,
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


const ProjectInfo = ({ project }) => {
  return (
    <div className="w-60 border-l flex flex-col bg-muted/50 hidden lg:flex">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-1">Project Info</h2>
        <p className="text-sm text-muted-foreground">
          {project?.description?.slice(0, 100)}...
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <section>
            <h3 className="text-sm font-medium mb-2">Details</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="text-muted-foreground">Status: </span>
                <span>{project?.status}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Created: </span>
                <span>{new Date(project?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Deadline: </span>
                <span>{new Date(project?.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-medium mb-2">Resources</h3>
            <div className="space-y-2">
              {project?.resources?.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline block"
                >
                  {resource.name}
                </a>
              ))}
            </div>
          </section>

          <Separator />

          <section>
            <h3 className="text-sm font-medium mb-2">Tags</h3>
            <div className="flex flex-wrap gap-1">
              {project?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-md bg-primary/10 text-primary text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button variant="outline" className="w-full">
          <Settings className="mr-2 h-4 w-4" />
          Project Settings
        </Button>
      </div>
    </div>
  );
};

export default ProjectInfo