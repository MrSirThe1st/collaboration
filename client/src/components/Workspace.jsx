import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import GroupsTable from "./admin/groupsTable";
import MemberProjectsTable from "./MemberProjectsTable";
import { useSelector } from "react-redux";
import useGetAllGroups from "@/hooks/useGetAllGroups";
import useGetAllProjects from "@/hooks/useGetAllProjects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, Users, Rocket, Loader } from "lucide-react";

const EmptyGroups = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] border-2 border-dashed rounded-lg">
    <Users className="h-12 w-12 text-muted-foreground mb-4 " />
    <h3 className="text-xl font-semibold mb-2">No Groups Created Yet</h3>
    <p className="text-muted-foreground mb-4 max-w-md">
      Groups help you organize your projects and collaborate with your team.
      Start by creating a group—once you do, you’ll be able to create your first
      project!
    </p>
  </div>
);

const EmptyProjects = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px] border-2 border-dashed rounded-lg">
    <div className="relative mb-4">
      <Rocket className="h-12 w-12 text-muted-foreground " />
      {/* <Target className="h-8 w-8 text-primary absolute -right-2 -bottom-2 animate-spin" /> */}
    </div>
    <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
    <p className="text-muted-foreground mb-4 max-w-md">
      Looks like you have not joined any projects yet. Create a new project or
      join an existing one to get started!
    </p>
  </div>
);

const Workspace = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { groups, loading: groupsLoading } = useSelector(
    (state) => state.group
  );
  const { allProjects, loading: projectsLoading } = useSelector(
    (state) => state.project
  );

  // Fetch groups and projects
  useGetAllGroups();
  useGetAllProjects();

  // Filter groups for the current user
  const userGroups =
    user && groups ? groups.filter((group) => group.userId === user._id) : [];

  // Filter projects for the current user
   const userProjects =
     user && allProjects
       ? allProjects.filter((project) =>
           project.members.some((member) => member.user === user._id)
         )
       : [];

  if (groupsLoading && projectsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-4 sm:my-6">
      <div className="flex gap-3 my-3">
        <Button onClick={() => navigate("/admin/create")}>
          <Plus className="h-5 w-5 mr-2" />
          New Group
        </Button>
      </div>

      <Tabs defaultValue="groups" className="my-7">
        <TabsList className="grid w-full grid-cols-2 rounded-lg border border-muted bg-transparent">
          <TabsTrigger
            value="groups"
            className="data-[state=active]:bg-muted/20 data-[state=active]:text-foreground"
          >
            Groups
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-muted/20 data-[state=active]:text-foreground"
          >
            Projects
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups">
          {groupsLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader className="w-8 h-8 animate-spin" />
            </div>
          ) : userGroups.length === 0 ? (
            <EmptyGroups />
          ) : (
            <GroupsTable groups={userGroups} />
          )}
        </TabsContent>

        <TabsContent value="projects">
          {projectsLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader className="w-8 h-8 animate-spin" />
            </div>
          ) : userProjects.length === 0 ? (
            <EmptyProjects />
          ) : (
            <MemberProjectsTable projects={userProjects} user={user} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Workspace;
