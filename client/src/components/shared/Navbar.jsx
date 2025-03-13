import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Badge } from "../ui/badge";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    <div >
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <h1 className="text-2xl font-bold">
    
          </h1>
        </div>
        <div className="flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li>
                  <Link to="/browse">Browse</Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button >
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <Badge
                className={`text-white font-bold`}
                variant="dot"
                style={{
                  backgroundColor: getStatusColor(user?.status),
                }}
              />
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="">
                  <div className="flex gap-2 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="@shadcn"
                      />
                    </Avatar>
                    <Badge
                      className={`text-white font-bold`}
                      variant="dot"
                      style={{
                        backgroundColor: getStatusColor(user?.status),
                      }}
                    />
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    <div className="flex w-full items-center gap-2 cursor-pointer">
                      <Clock color="green" />
                      <button
                        onClick={() => updateStatus("available")}
                        className="bg-transparent hover:bg-gray-200 text-black py-2 px-4 rounded-md w-32 h-10"
                      >
                        Available
                      </button>
                    </div>
                    <div className="flex w-full items-center gap-2 cursor-pointer my-2">
                      <Clock color="orange" />
                      <button
                        className="bg-transparent hover:bg-gray-200 text-black py-2 px-4 rounded-md w-32 h-10"
                        onClick={() => updateStatus("busy")}
                      >
                        Busy
                      </button>
                    </div>
                    <div className="flex w-full items-center gap-2 cursor-pointer">
                      <Clock color="red" />
                      <button
                        className="bg-transparent hover:bg-gray-200 text-black py-2 px-4 rounded-md w-32 h-10"
                        onClick={() => updateStatus("away")}
                      >
                        Away
                      </button>
                    </div>

                    {user && (
                      <div className="flex w-full items-center gap-2 cursor-pointer">
                        <User2 />
                        <Button className="bg-transparent hover:bg-gray-200 text-black py-2 px-4 rounded-md w-32 h-10">
                          {" "}
                          <Link to="/profile">View Profile</Link>
                        </Button>
                      </div>
                    )}

                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut />
                      <Button
                        onClick={logoutHandler}
                        className="bg-transparent hover:bg-gray-200 text-black py-2 px-4 rounded-md w-32 h-10"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
