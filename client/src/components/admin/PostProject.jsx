import React, { useState } from "react";
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
import { Textarea } from "../ui/textarea";

import axios from "axios";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import DatePickerWithRange from "../DatePickerWithRange";

const PostProject = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    maxTeamSize: 0,
    groupId: "",
    file: null,
    status: "Planning",
    isOpen: true,
    openPositions: "",
    dateRange: {
      from: null,
      to: null,
    },
    tags: "",
    skills: "",
    communicationPlatform: "",
    communicationLink: "",
    budgetEstimated: 0,
    budgetCurrent: 0,
    budgetCurrency: "USD",
    socialInstagram: "",
    socialTwitter: "",
    socialLinkedin: "",
    socialGithub: "",
    socialWebsite: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { groups } = useSelector((store) => store.group);

  const changeEventHandler = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setInput({ ...input, [e.target.name]: value });
  };

  const selectChangeHandler = (name, value) => {
    setInput({ ...input, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      for (const key in input) {
        if (key === "file" && input[key]) {
          formData.append("file", input[key]);
        } else if (key === "dateRange") {
          formData.append("startDate", input.dateRange.from);
          formData.append("endDate", input.dateRange.to);
        } else if (Array.isArray(input[key])) {
          formData.append(key, JSON.stringify(input[key]));
        } else if (input[key] !== null && input[key] !== undefined) {
          formData.append(key, input[key]);
        }
      }

      const res = await axios.post(`${PROJECT_API_END_POINT}/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
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

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  return (
    <div className="flex items-center justify-center w-screen my-5">
      <form
        onSubmit={submitHandler}
        className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Project Date Range</Label>
            <DatePickerWithRange input={input} setInput={setInput} />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              type="text"
              name="title"
              value={input.title}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>Requirements (comma-separated)</Label>
            <Input
              type="text"
              name="requirements"
              value={input.requirements}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              value={input.location}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>Max Team Size</Label>
            <Input
              type="number"
              name="maxTeamSize"
              value={input.maxTeamSize}
              onChange={changeEventHandler}
              required
            />
          </div>
          <div>
            <Label>Group</Label>
            <Select
              name="groupId"
              onValueChange={(value) => selectChangeHandler("groupId", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {groups.map((group) => (
                    <SelectItem value={group._id} key={group._id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Logo</Label>
            <Input type="file" accept="image/*" onChange={changeFileHandler} />
          </div>
          <div>
            <Label>Status</Label>
            <Select
              name="status"
              onValueChange={(value) => selectChangeHandler("status", value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    "Planning",
                    "In Progress",
                    "On Hold",
                    "Completed",
                    "Cancelled",
                  ].map((status) => (
                    <SelectItem value={status} key={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Is Open</Label>
            <Input
              type="checkbox"
              name="isOpen"
              checked={input.isOpen}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Open Positions (comma-separated)</Label>
            <Input
              type="text"
              name="openPositions"
              value={input.openPositions}
              onChange={changeEventHandler}
            />
          </div>

          <div>
            <Label>Tags (comma-separated)</Label>
            <Input
              type="text"
              name="tags"
              value={input.tags}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Skills (comma-separated)</Label>
            <Input
              type="text"
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Communication Platform</Label>
            <Input
              type="text"
              name="communicationPlatform"
              value={input.communicationPlatform}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Communication Link</Label>
            <Input
              type="text"
              name="communicationLink"
              value={input.communicationLink}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Estimated Budget</Label>
            <Input
              type="number"
              name="budgetEstimated"
              value={input.budgetEstimated}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Current Budget</Label>
            <Input
              type="number"
              name="budgetCurrent"
              value={input.budgetCurrent}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Budget Currency</Label>
            <Input
              type="text"
              name="budgetCurrency"
              value={input.budgetCurrency}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input
              type="text"
              name="socialInstagram"
              value={input.socialInstagram}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Twitter</Label>
            <Input
              type="text"
              name="socialTwitter"
              value={input.socialTwitter}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>LinkedIn</Label>
            <Input
              type="text"
              name="socialLinkedin"
              value={input.socialLinkedin}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>GitHub</Label>
            <Input
              type="text"
              name="socialGithub"
              value={input.socialGithub}
              onChange={changeEventHandler}
            />
          </div>
          <div>
            <Label>Website</Label>
            <Input
              type="text"
              name="socialWebsite"
              value={input.socialWebsite}
              onChange={changeEventHandler}
            />
          </div>
        </div>
        {loading ? (
          <Button className="w-full my-4" disabled>
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
  );
};

export default PostProject;
