import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea"; // Import if not already imported
import SkillSelector from "./SkillSelector"; // Import the SkillSelector we created
import { SKILL_CATEGORIES } from "../constants/skills";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.profile?.bio || "",
    file: null,
    github: user?.profile?.socialLinks?.github || "",
    linkedin: user?.profile?.socialLinks?.linkedin || "",
    portfolio: user?.profile?.socialLinks?.portfolio || "",
  });

  // Initialize selectedSkills with user's existing skills
  const [selectedSkills, setSelectedSkills] = useState(() => {
    if (!user?.profile?.skills) return [];
    return user.profile.skills.map((skillName) => {
      const skillInfo = Object.values(SKILL_CATEGORIES)
        .flatMap((category) => category.skills)
        .find((s) => s.name === skillName);
      return skillInfo || { name: skillName };
    });
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("bio", input.bio);
    formData.append("github", input.github);
    formData.append("linkedin", input.linkedin);
    formData.append("portfolio", input.portfolio);
    formData.append(
      "skills",
      JSON.stringify(selectedSkills.map((skill) => skill.name))
    );

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3"
                disabled
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Skills</Label>
              <div className="col-span-3">
                <SkillSelector
                  selectedSkills={selectedSkills}
                  onSkillSelect={setSelectedSkills}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="github" className="text-right">
                GitHub
              </Label>
              <Input
                id="github"
                name="github"
                value={input.github}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="GitHub profile URL"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="linkedin" className="text-right">
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                value={input.linkedin}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="LinkedIn profile URL"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="portfolio" className="text-right">
                Portfolio
              </Label>
              <Input
                id="portfolio"
                name="portfolio"
                value={input.portfolio}
                onChange={changeEventHandler}
                className="col-span-3"
                placeholder="Portfolio website URL"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                Resume
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept="application/pdf"
                onChange={fileChangeHandler}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
