import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";


const PostProject = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    maxTeamSize: 0,
    groupId: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { groups } = useSelector((store) => store.group);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const selectChangeHandler = (value) => {
    const selectedGroup = groups.find(
      (group) => group.name.toLowerCase() === value
    );
    setInput({ ...input, groupId: selectedGroup._id });
  };

 const submitHandler = async (e) => {
   e.preventDefault();
   console.log("Submitting data:", input);
   try {
     setLoading(true);
     const res = await axios.post(`${PROJECT_API_END_POINT}/post`, input, {
       headers: {
         "Content-Type": "application/json",
       },
       withCredentials: true,
     });
     console.log("Response:", res);
     if (res.data.success) {
       toast.success(res.data.message);
       navigate("/admin/group");
     }
   } catch (error) {
     console.error("Error submitting project:", error);
     toast.error(error.response?.data?.message || "An error occurred");
   } finally {
     setLoading(false);
   }
 };

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Title</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            <div>
              <Label>Team size</Label>
              <Input
                type="number"
                name="maxTeamSize"
                value={input.maxTeamSize}
                onChange={changeEventHandler}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
            </div>
            {groups.length > 0 && (
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {groups.map((group) => {
                      return (
                        <SelectItem
                          value={group?.name?.toLowerCase()}
                          key={group._id}
                        >
                          {group.name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Post New Project
            </Button>
          )}
          {groups.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a group first, before posting a project
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostProject;
