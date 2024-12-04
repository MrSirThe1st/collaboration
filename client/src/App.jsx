import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Group from "./components/admin/group";
import Profile from "./components/Profile";
import PostProject from "./components/admin/PostProject";
import GroupCreate from "./components/admin/GroupCreate";
import GroupSetup from "./components/admin/GroupSetup";
import Category from "./components/Category";
import UserDetail from "./components/UserDetail";
import ProjectDescription from "./components/ProjectDescription";
import ProjectPage from "./components/admin/ProjectPage";
import { SocketContextProvider } from "../context/SocketContext";
import Layout from "./components/Layout";
import Invitations from "./components/Invitations";
import InvitationsOut from "./components/InvitationsOut";
import ProjectsRequested from "./components/ProjectsRequested";
import Workspace from "./components/Workspace";
import Layout2 from "./components/Layout2";
import AllInvitations from "./components/AllInvitations";
import Team from "./components/Team";
import Inbox from "./components/Inbox";


const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin/create",
    element: <GroupCreate />,
  },
  {
    path: "/admin/group/:id",
    element: (
      <Layout>
        <Group />
      </Layout>
    ),
  },
  // {
  //   path: "/admin/group",
  //   element: <Group />,
  // },
  {
    path: "/profile/:id",
    element: <GroupSetup />,
  },
  {
    path: "/admin/projects/create",
    element: <PostProject />,
  },
  {
    path: "/description/:id",
    element: <ProjectDescription />,
  },
  {
    path: "/admin/groups/:id",
    element: <GroupSetup />,
  },
  // {
  //   path: "/admin/projects/:id/requesters",
  //   element: <Requesters />,
  // },
  {
    path: "/invitations",
    element: (
      <Layout>
        <Invitations />
      </Layout>
    ),
  },
  {
    path: "/invitationsOut",
    element: (
      <Layout>
        <InvitationsOut />
      </Layout>
    ),
  },
  {
    path: "/allInvitations",
    element: (
      <Layout>
        <AllInvitations />
      </Layout>
    ),
  },
  {
    path: "/profile",
    element: (
      <Layout>
        <Profile />
      </Layout>
    ),
  },
  {
    path: "/projectsRequested",
    element: (
      <Layout>
        <ProjectsRequested />
      </Layout>
    ),
  },
  {
    path: "/workspace",
    element: (
      <Layout>
        <Workspace />
      </Layout>
    ),
  },
  {
    path: "/team",
    element: (
      <Layout>
        <Team />
      </Layout>
    ),
  },
  {
    path: "/inbox",
    element: (
      <Layout>
        <Inbox />
      </Layout>
    ),
  },
  {
    path: "/profession/:profession",
    element: <Category />,
  },
  {
    path: "/user/:id",
    element: (
      <Layout>
        <UserDetail />
      </Layout>
    ),
  },
  // {
  //   path: "/projects/:id/requesters",
  //   element: <Requesters />,
  // },
  {
    path: "/admin/projects/:id/page",
    element: <ProjectPage />,
  },
  {
    path: "/projects/:id",
    element: <ProjectPage />,
  },
]);

function App() {
  return (
    <div>
      <SocketContextProvider>
        <RouterProvider router={appRouter} />
      </SocketContextProvider>
    </div>
  );
}

export default App;
