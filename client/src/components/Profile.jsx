import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  Contact,
  Mail,
  Pen,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import GroupsTable from "./admin/groupsTable";
import useGetAllGroups from "@/hooks/useGetAllGroups";
import { useDispatch } from "react-redux";
import { setSearchGroupByText } from "@/redux/groupSlice";
import RequestedProjectTable from "./RequestedProjectTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetRequestedProjects from "@/hooks/useGetRequestedProjects";
import useGetSentInvitations from "@/hooks/useGetSentInvitations";
import useGetReceivedInvitations from "@/hooks/useGetReceivedInvitations";
import { Link } from "react-router-dom";
import InvitationSentTable from "./InvitationSentTable";
import InvitersTable from "./admin/InvitersTable";

const isResume = true;

const Profile = () => {

  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setSearchGroupByText(input));
  }, [input]);

  return (
    <div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-2 lg:gap-2 lg:px-6">
          <div
            className="flex flex-1 items-center my-5 p-3 rounded-lg border border-dashed shadow-sm"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className=" flex-col items-center gap-1 text-center">
              <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
                <h1>Links for everyone to access</h1>
                <div className="flex justify-between">
                  <h1>Links for everyone to access</h1>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="@shadcn"
                      />
                    </Avatar>
                    <div>
                      <h1 className="font-medium text-xl">{user?.username}</h1>
                      <p>{user?.profile?.bio}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setOpen(true)}
                    className="text-right"
                    variant="outline"
                  >
                    <Pen />
                  </Button>
                </div>
                <div className="my-5">
                  <div className="flex items-center gap-3 my-2">
                    <Mail />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 my-2">
                    <Contact />
                    <span>{user?.profession || "NA"}</span>
                  </div>
                </div>
                <div className="my-5">
                  <h1>Skills</h1>
                  <div className="flex items-center gap-1">
                    {user?.profile?.skills.length !== 0 ? (
                      user?.profile?.skills.map((item, index) => (
                        <Badge key={index}>{item}</Badge>
                      ))
                    ) : (
                      <span>NA</span>
                    )}
                  </div>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label className="text-md font-bold">Resume</Label>
                  {isResume ? (
                    <a
                      target="blank"
                      href={user?.profile?.resume}
                      className="text-blue-500 w-full hover:underline cursor-pointer"
                    >
                      {user?.profile?.resumeOriginalName}
                    </a>
                  ) : (
                    <span>NA</span>
                  )}
                </div>
              </div>

              <UpdateProfileDialog open={open} setOpen={setOpen} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
