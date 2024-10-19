import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  LogOut,
  Home,
  Users,
  ShoppingCart,
  Mail,
  Menu,
  ChevronDown,
  PackagePlus,
  ChevronsRight,
  ChevronsLeft,
  Earth,
  Hammer,
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

const Sidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [position, setPosition] = useState("bottom");
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMenuSelect = (value) => {
    if (value === "top") {
      navigate("/invitationsOut");
    } else if (value === "bottom") {
      navigate("/invitations");
    }
    setPosition(value);
  };

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const updateStatus = async (status) => {
    try {
      const res = await axios.put(
        `${USER_API_END_POINT}/status`,
        { status },
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen flex ">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block ${
          isCollapsed ? "w-20" : "w-60"
        } bg-muted/40 border-r border-border transition-all duration-300 `}
      >
        <div className="flex flex-col h-full gap-4 p-4">
          {/* Logo and Profile */}
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center w-full justify-between">
              <Link
                to="/"
                className={`text-2xl font-bold text-primary ${
                  isCollapsed ? "hidden" : ""
                }`}
              >
                Co-founder
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

            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center justify-between gap-3 w-full p-2 bg-muted hover:bg-white cursor-pointer rounded-lg transition-all">
                    <div>
                      <h1 className="font-medium text-primary">
                        {user?.username}
                      </h1>
                      <p className="text-xs text-muted-foreground">
                        {user?.profile?.bio}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52">
                  <div className="p-4">
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-xs text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                  <DropdownMenuItem onClick={() => updateStatus("available")}>
                    Available
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus("busy")}>
                    Busy
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => updateStatus("away")}>
                    Away
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/profile" className="flex items-center">
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

          {/* Navigation */}
          <nav className="flex-1">
            <ul className="flex flex-col gap-2">
              <Link
                to="/"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-4"
                } rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                  isActive("/") ? "bg-white text-foreground" : ""
                }`}
              >
                <Earth className={isCollapsed ? "h-7 w-7" : "h-5 w-5"} />
                {!isCollapsed && "Projects"}
              </Link>
              <Link
                to="/workspace"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-4"
                } rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                  isActive("/workspace") ? "bg-white text-foreground" : ""
                }`}
              >
                <Hammer className={isCollapsed ? "h-7 w-7" : "h-5 w-5"} />
                {!isCollapsed && "Workspace"}
              </Link>
              <Link
                to="/allInvitations"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-4"
                } rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                  isActive("/allInvitations") ? "bg-white text-foreground" : ""
                }`}
              >
                <Mail className={isCollapsed ? "h-7 w-7" : "h-5 w-5"} />
                {!isCollapsed && "Invitations"}
                {!isCollapsed && <Badge className="ml-auto">6</Badge>}
              </Link>
              <Link
                to="/team"
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "gap-4"
                } rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground ${
                  isActive("/team") ? "bg-white text-foreground" : ""
                }`}
              >
                <Users className={isCollapsed ? "h-7 w-7" : "h-5 w-5"} />
                {!isCollapsed && "team"}
              </Link>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="flex flex-col md:hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 ">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <span>Acme Inc</span>
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Members
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="/workspace"
                  className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Workspace
                </Link>

                {/* Invitations with Sent/Received options for mobile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer">
                      <Mail className="h-4 w-4" />
                      Invitations
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup onValueChange={handleMenuSelect}>
                      <DropdownMenuRadioItem value="top">
                        Sent
                      </DropdownMenuRadioItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioItem value="bottom">
                        Received
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
};

export default Sidebar;
