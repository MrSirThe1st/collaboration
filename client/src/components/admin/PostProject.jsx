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

const CATEGORIES = [
  { value: "Web Development", label: "Web Development" },
  { value: "Mobile Development", label: "Mobile Development" },
  { value: "UI/UX Design", label: "UI/UX Design" },
  { value: "Data Science", label: "Data Science" },
];

const PostProject = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    groupId: "",
    file: null,
    skills: "",
    communicationPlatform: "",
    communicationLink: "",
    socialInstagram: "",
    socialTwitter: "",
    socialLinkedin: "",
    socialGithub: "",
    socialWebsite: "",
    category: "",
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

      // Create communication and social links objects
      const communication = {
        platform: input.communicationPlatform || "",
        link: input.communicationLink || "",
      };

      const socialLinks = {
        instagram: input.socialInstagram || "",
        twitter: input.socialTwitter || "",
        linkedin: input.socialLinkedin || "",
        github: input.socialGithub || "",
        website: input.socialWebsite || "",
      };

      // Split requirements and skills into arrays
      const requirements = input.requirements
        ? input.requirements
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      const skills = input.skills
        ? input.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

      // Append all fields to FormData
      formData.append("title", input.title);
      formData.append("description", input.description);
      formData.append("requirements", JSON.stringify(requirements));
      formData.append("skills", JSON.stringify(skills));
      formData.append("groupId", input.groupId);
      formData.append("category", input.category);
      formData.append("communication", JSON.stringify(communication));
      formData.append("socialLinks", JSON.stringify(socialLinks));

      if (input.file) {
        formData.append("file", input.file);
      }

      console.log("Sending data:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
        try {
          const parsed = JSON.parse(value);
          console.log(`${key} (parsed):`, parsed);
        } catch (e) {
          // Not JSON, ignore
        }
      }

      const res = await axios.post(`${PROJECT_API_END_POINT}/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(`/admin/group/${input.groupId}`);
      }
    } catch (error) {
      console.error("Error submitting project:", error);
      // Log more detailed error information
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data?.message || "Server error occurred");
      } else {
        toast.error("An error occurred while submitting the project");
      }
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
        className="p-8 max-w-4xl border  shadow-lg rounded-md"
      >
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <Label>Category</Label>
            <Select
              name="category"
              onValueChange={(value) => selectChangeHandler("category", value)}
              required
              className={!input.category ? "border-red-500" : ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {CATEGORIES.map((category) => (
                    <SelectItem value={category.value} key={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
