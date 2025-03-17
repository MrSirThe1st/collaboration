import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
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
import AllInvitations from "./components/AllInvitations";
import Team from "./components/Team";
import Inbox from "./components/Inbox";
import EditProject from "./components/admin/EditProject";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import LandingPage from "./components/LandingPage";
import AboutUs from "./components/About";
import ProfileEdit from "./components/ProfileEdit";
import Support from "./components/Support";
import CookieConsent from "./components/CookieConsent";
import PingTest from "./components/PingTest";
import { useSelector } from "react-redux";

// Custom route component to check authentication
const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((store) => store.auth);

  // If user is not authenticated, redirect to landing page
  if (!user) {
    return <Navigate to="/landing" replace />;
  }

  return children;
};

const appRouter = createBrowserRouter([
  {
    // Default route redirects to landing for new visitors
    path: "/",
    element: <Navigate to="/landing" replace />,
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <Layout>
          <ProfileEdit />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/ping",
    element: <PingTest />,
  },
  {
    path: "/support",
    element: <Support />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <Layout>
          <Home />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
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
    element: (
      <ProtectedRoute>
        <GroupCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/group/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <Group />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfService />,
  },
  {
    path: "/profile/:id",
    element: (
      <ProtectedRoute>
        <GroupSetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/projects/create",
    element: (
      <ProtectedRoute>
        <PostProject />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/projects/:id/edit",
    element: (
      <ProtectedRoute>
        <EditProject />
      </ProtectedRoute>
    ),
  },
  {
    path: "/description/:id",
    element: <ProjectDescription />,
  },
  {
    path: "/admin/groups/:id",
    element: (
      <ProtectedRoute>
        <GroupSetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/invitations",
    element: (
      <ProtectedRoute>
        <Layout>
          <Invitations />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/invitationsOut",
    element: (
      <ProtectedRoute>
        <Layout>
          <InvitationsOut />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/allInvitations",
    element: (
      <ProtectedRoute>
        <Layout>
          <AllInvitations />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Layout>
          <Profile />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/projectsRequested",
    element: (
      <ProtectedRoute>
        <Layout>
          <ProjectsRequested />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/workspace",
    element: (
      <ProtectedRoute>
        <Layout>
          <Workspace />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/team",
    element: (
      <ProtectedRoute>
        <Layout>
          <Team />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inbox",
    element: (
      <ProtectedRoute>
        <Layout>
          <Inbox />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profession/:profession",
    element: (
      <ProtectedRoute>
        <Category />
      </ProtectedRoute>
    ),
  },
  {
    path: "/user/:id",
    element: (
      <ProtectedRoute>
        <Layout>
          <UserDetail />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/projects/:id/page",
    element: (
      <ProtectedRoute>
        <ProjectPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:id",
    element: (
      <ProtectedRoute>
        <ProjectPage />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  return (
    <div>
      <SocketContextProvider>
        <RouterProvider router={appRouter} />
        <CookieConsent />
      </SocketContextProvider>
    </div>
  );
}

export default App;
