import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import GroupsTable from "./admin/groupsTable";
import MemberProjectsTable from "./MemberProjectsTable";
import { useSelector } from "react-redux";
import useGetAllGroups from "@/hooks/useGetAllGroups";
import useGetAllProjects from "@/hooks/useGetAllProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"; 
import { Plus } from "lucide-react";

const Workspace = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { user } = useSelector((store) => store.auth);
  const { groups } = useSelector((state) => state.group);
  const { allProjects } = useSelector((state) => state.project);

  // Call hooks only once
  useGetAllGroups();
  useGetAllProjects();

  // Memoize these calculations to prevent unnecessary re-renders
  const userGroups = React.useMemo(
    () => groups.filter((group) => group.created_by === user._id),
    [groups, user._id]
  );

  const userProjects = React.useMemo(
    () =>
      allProjects.filter((project) =>
        project.members.some((member) => member.user === user._id)
      ),
    [allProjects, user._id]
  );

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="flex items-center justify-between my-3">
        <Button onClick={() => navigate("/admin/create")}>
          <Plus className="h-5 w-5" />
          New Group
        </Button>
      </div>

      {/* Tabs Implementation */}
      <Tabs defaultValue="groups">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          <GroupsTable groups={userGroups} />
        </TabsContent>

        <TabsContent value="projects">
          <MemberProjectsTable projects={userProjects} user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workspace;
