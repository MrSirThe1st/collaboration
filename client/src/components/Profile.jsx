import React, { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, Save, X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import SkillSelector from "./SkillSelector";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    file: null,
    github: user?.profile?.socialLinks?.github || "",
    linkedin: user?.profile?.socialLinks?.linkedin || "",
    portfolio: user?.profile?.socialLinks?.portfolio || "",
  });

  const [selectedSkills, setSelectedSkills] = useState(
    user?.profile?.skills.map((skill) => ({ name: skill })) || []
  );

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setInput({ ...input, file: e.target.files[0] });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(input).forEach((key) => {
      if (input[key]) formData.append(key, input[key]);
    });
    formData.append(
      "skills",
      JSON.stringify(selectedSkills.map((skill) => skill.name))
    );

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <main className="flex flex-1 flex-col gap-4 p-2 lg:gap-2 lg:px-6">
        <div className="flex flex-1 items-center my-5 p-3 rounded-lg border border-dashed shadow-sm">
          <div className="flex-col items-center gap-1 text-center w-full">
            <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt={user?.username}
                      />
                    </Avatar>
                    {isEditing && (
                      <Input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                      />
                    )}
                  </div>
                  <div className="space-y-2 text-left">
                    {isEditing ? (
                      <Input
                        name="username"
                        value={input.username}
                        onChange={handleChange}
                        className="text-xl font-medium"
                      />
                    ) : (
                      <h1 className="text-xl font-medium">{user?.username}</h1>
                    )}
                    {isEditing ? (
                      <Textarea
                        name="bio"
                        value={input.bio}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-600">
                        {user?.profile?.bio || "No bio yet"}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {isEditing ? (
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button onClick={handleSubmit} disabled={loading}>
                        <Save className="w-4 h-4 mr-1" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pen className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-6 text-left">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label>Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Skills</Label>
                  {isEditing ? (
                    <SkillSelector
                      selectedSkills={selectedSkills}
                      onSkillSelect={setSelectedSkills}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user?.profile?.skills?.length > 0 ? (
                        user.profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">
                          No skills added yet
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {isEditing ? (
                    <>
                      <div>
                        <Label>GitHub</Label>
                        <Input
                          name="github"
                          value={input.github}
                          onChange={handleChange}
                          placeholder="GitHub profile URL"
                        />
                      </div>
                      <div>
                        <Label>LinkedIn</Label>
                        <Input
                          name="linkedin"
                          value={input.linkedin}
                          onChange={handleChange}
                          placeholder="LinkedIn profile URL"
                        />
                      </div>
                      <div>
                        <Label>Portfolio</Label>
                        <Input
                          name="portfolio"
                          value={input.portfolio}
                          onChange={handleChange}
                          placeholder="Portfolio website URL"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 space-y-2">
                      <Label>Social Links</Label>
                      <div className="flex gap-4">
                        {user?.profile?.socialLinks?.github && (
                          <a
                            href={user.profile.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            GitHub
                          </a>
                        )}
                        {user?.profile?.socialLinks?.linkedin && (
                          <a
                            href={user.profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            LinkedIn
                          </a>
                        )}
                        {user?.profile?.socialLinks?.portfolio && (
                          <a
                            href={user.profile.socialLinks.portfolio}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Portfolio
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
