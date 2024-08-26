import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import Group from "./components/admin/group";
import Profile from "./components/Profile";
import Groups from "./components/admin/groups";
import PostProject from "./components/admin/PostProject";
import GroupCreate from "./components/admin/GroupCreate";
import GroupSetup from "./components/admin/GroupSetup";
import Category from "./components/Category";
import UserDetail from "./components/UserDetail";
import ProjectDescription from "./components/ProjectDescription";
import Requesters from "./components/admin/Requesters";
import ProjectPage from "./components/admin/ProjectPage";
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
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
    element: <Group />,
  },
  {
    path: "/admin/group",
    element: <Group />,
  },
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
  {
    path: "/admin/projects/:id/requesters",
    element: <Requesters />,
  },
  // {
  //   path: "/home/Category",
  //   element: <Category />,
  // },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/profession/:profession",
    element: <Category />,
  },
  {
    path: "/user/:id",
    element: <UserDetail />,
  },
  {
    path: "/projectss/:id/requesters",
    element: <Requesters />,
  },
  {
    path: "/admin/projects/:id/page",
    element: <ProjectPage />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
