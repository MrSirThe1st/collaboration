import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  LogOut,
  User2,
  Clock,
  SquareChevronDown,
  ChevronDown,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "../ui/dropdown-menu";
import {
  Package2,
  Home,
  ShoppingCart,
  Package,
  Users,
  LineChart,
  Menu,
  Mailbox,
  PackagePlus,
} from "lucide-react";

const SidebarWorkspace = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [position, setPosition] = React.useState("bottom");

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
        localStorage.removeItem("token");
        dispatch(setUser(null));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "green";
      case "busy":
        return "orange";
      case "away":
        return "red";
      default:
        return "green"; // Default color
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
      console.log(error);
      toast.error("Failed to update status.");
    }
  };
  return (
    <div className="min-h-screen flex">
      <div className="hidden border-r bg-muted/40 md:block w-64 border-dashed">
        {" "}
        <div className="flex h-full flex-col gap-2">
          <div className="flex flex-col h-14 items-start px-4 lg:h-[60px] lg:px-6 ">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <h1 className="text-2xl font-bold text-[#F83002]">LOGO</h1>
            </Link>
            <DropdownMenu>
              <div className="flex items-center space-between">
                <DropdownMenuTrigger asChild>
                  <div>
                    <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1 text-black transition-all hover:text-primary cursor-pointer border border-gray rounded-lg">
                      <div className="flex items-center gap-3">
                        <h1 className="font-medium text-sm">
                          {user?.username}'s profile
                        </h1>
                        <p className="text-xs">{user?.profile?.bio}</p>
                      </div>
                      <div className="ml-auto">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <div className="cursor-pointer rounded-full border-2 border-transparent bg-primary p-1 hover:bg-primary/80 transition-colors duration-200 shadow-lg">
                  <PackagePlus className="h-4 w-4 text-white" />
                </div>
              </div>

              <DropdownMenuContent className="w-50">
                <div className="flex gap-2 space-y-2">
                  <Badge
                    className="text-white font-bold"
                    variant="dot"
                    style={{ backgroundColor: getStatusColor(user?.status) }}
                  />
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <span>status</span>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateStatus("available")}>
                  <div className="cursor-pointer"> Available to work</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateStatus("busy")}>
                  <div className="cursor-pointer">On a project</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => updateStatus("away")}>
                  <div className="cursor-pointer">Not available</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {user && (
                    <div className="flex w-full items-center cursor-pointer">
                      <User2 className="h-4 w-4" />
                      <Link to="/profile">View Profile</Link>
                    </div>
                  )}
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logoutHandler}>
                  <div className="flex w-fit items-center  cursor-pointer">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sidebar Navigation */}
          <div className="flex-1 overflow-y-auto">
            {" "}
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <li
                href=""
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Home className="h-4 w-4" />
                <Link to="/">Home</Link>
              </li>
              <Link
                href="#"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Members
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  6
                </Badge>
              </Link>
              <li className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
                <Users className="h-4 w-4" />
                <Link to="/workspace">Workspace</Link>
              </li>
              <li
                href="/projectsRequested"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Users className="h-4 w-4" />
                <Link to="/projectsRequested">Project requests</Link>
              </li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <li
                    variant="outline"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary cursor-pointer"
                  >
                    <Mailbox className="h-4 w-4" />
                    Invitations
                  </li>
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
          </div>
        </div>
      </div>

      {/* Mobile Sidebar with Sheet */}
      <div className="flex flex-col md:hidden">
        {" "}
        {/* Show mobile sidebar only on small screens */}
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
                  <Package2 className="h-6 w-6" />
                  <span>Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Members
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    6
                  </Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
      </div>
    </div>
  );
};

export default SidebarWorkspace;
