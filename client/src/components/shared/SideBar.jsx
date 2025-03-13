import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  LogOut,
  Home,
  Users,
  ChevronDown,
  ChevronsRight,
  ChevronsLeft,
  Earth,
  Hammer,
  AtSign,
  MessageCircle,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Badge } from "../ui/badge";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import smallLogo from "@/assets/logo/Concept-3-v2.png";
import largeLogo from "@/assets/logo/Logo.png";
import UserAvatar from "../customUI/UserAvatar";

const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const totalUnreadMessages = useSelector((state) => state.inbox.totalUnread);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        localStorage.removeItem("token");
        dispatch(setUser(null));
        navigate("/landing");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    // Only apply sidebar width on non-mobile devices
    if (!isMobile) {
      document.documentElement.style.setProperty(
        "--sidebar-width",
        isCollapsed ? "80px" : "240px"
      );
    }
  }, [isCollapsed, isMobile]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
    setIsCollapsed(newState);
    document.documentElement.style.setProperty(
      "--sidebar-width",
      newState ? "80px" : "240px"
    );
  };

  // Navigation links array for DRY code
  const navLinks = [
    { path: "/", icon: Earth, label: "Projects" },
    { path: "/workspace", icon: Hammer, label: "Workspace" },
    { path: "/allInvitations", icon: AtSign, label: "Invitations" },
    { path: "/team", icon: Users, label: "Team" },
    {
      path: "/inbox",
      icon: MessageCircle,
      label: "Messages",
      badge: totalUnreadMessages,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block ${
          isCollapsed ? "w-20" : "w-60"
        } bg-muted/40 border-r border-border transition-all duration-300 h-screen fixed top-0 left-0 z-50`}
      >
        <div className="flex flex-col h-full gap-4 p-4">
          {/* Logo and Toggle */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center w-full justify-between">
              <Link
                to="/"
                className={`${isCollapsed ? "w-10 h-10" : "w-32 h-8"}`}
              >
                {isCollapsed ? (
                  <img
                    src={largeLogo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={largeLogo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                )}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="self-end mt-auto"
              >
                {isCollapsed ? (
                  <ChevronsRight className="h-5 w-5" />
                ) : (
                  <ChevronsLeft className="h-5 w-5" />
                )}
              </Button>
            </div>

            {/* User Profile - Only show when expanded */}
            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center justify-between gap-3 w-full p-2 bg-muted hover:bg-accent cursor-pointer rounded-lg transition-all">
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} size="sm" showStatus />
                      <div>
                        <h1 className="font-medium text-primary">
                          {user?.username}
                        </h1>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52">
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center w-full">
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler}>
                    <div className="flex items-center">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "gap-4"
                  } rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                    isActive(link.path) ? "bg-muted text-foreground" : ""
                  } relative`}
                >
                  <link.icon className={isCollapsed ? "h-7 w-7" : "h-5 w-5"} />
                  {!isCollapsed && link.label}
                  {link.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className={`${
                        isCollapsed ? "absolute -top-1 -right-1" : "ml-auto"
                      } bg-red-500 text-white`}
                    >
                      {link.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Header */}
      <div className="md:hidden fixed top-0 left-0 z-40 w-full h-16 bg-background border-b flex items-center px-4">
        {/* Menu Button (outside the Sheet component for clarity) */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-foreground"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex flex-col h-full">
              {/* Logo Header */}
              <div className="h-16 border-b flex items-center px-4">
                <img
                  src={smallLogo}
                  alt="Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>

              {/* User Profile */}
              <Button
                variant="ghost"
                className="w-full p-4 h-auto flex justify-start border-b rounded-none hover:bg-muted/50"
                onClick={() => {
                  navigate("/profile");
                  setIsSheetOpen(false);
                }}
              >
                <div className="flex items-center gap-3 w-full">
                  <UserAvatar user={user} size="sm" showStatus />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium truncate">{user?.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </Button>

              {/* Navigation Links */}
              <div className="flex-1 overflow-y-auto py-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsSheetOpen(false)}
                    className={`flex items-center gap-3 mx-2 px-3 py-3 rounded-md ${
                      isActive(link.path)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <link.icon className="h-5 w-5" />
                    <span>{link.label}</span>
                    {link.badge > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {link.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>

              {/* Footer with Logout */}
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500"
                  onClick={() => {
                    setIsSheetOpen(false);
                    logoutHandler();
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
