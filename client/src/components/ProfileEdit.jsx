import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft, Save, Trash2, Upload, Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import SkillSelector from "./SkillSelector";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import CountrySelect from "./ProjectMessages/components/CountrySelect";
import UserAvatar from "./customUI/UserAvatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { PROFESSIONS } from "@/data/professions";
import Footer from "./shared/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const ProfileEdit = () => {
  // State for loading and form data
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [previewUrl, setPreviewUrl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Track screen size for responsive UI decisions
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  // Form state
  const [input, setInput] = useState({
    username: "",
    email: "",
    bio: "",
    file: null,
    github: "",
    linkedin: "",
    portfolio: "",
    country: "",
    profession: "",
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isDeletePhotoLoading, setIsDeletePhotoLoading] = useState(false);

  // Listen for window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setInput({
        username: user.username || "",
        email: user.email || "",
        bio: user.profile?.bio || "",
        file: null,
        github: user.profile?.socialLinks?.github || "",
        linkedin: user.profile?.socialLinks?.linkedin || "",
        portfolio: user.profile?.socialLinks?.portfolio || "",
        country: user.profile?.country?.code || "",
        profession: user.profession || "",
      });

      setSelectedSkills(
        (user.profile?.skills || []).map((skill) => ({ name: skill }))
      );

      if (user.profile?.profilePhoto) {
        setPreviewUrl(user.profile.profilePhoto);
      }
    }
  }, [user]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== user?.profile?.profilePhoto) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, user]);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput({ ...input, file });
      // Create preview URL
      if (previewUrl && previewUrl !== user?.profile?.profilePhoto) {
        URL.revokeObjectURL(previewUrl);
      }
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      setIsDeletePhotoLoading(true);
      const response = await axios.delete(
        `${USER_API_END_POINT}/profile-photo`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(setUser(response.data.user));
        setPreviewUrl(null);
        toast.success("Profile photo deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting profile photo:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete profile photo"
      );
    } finally {
      setIsDeletePhotoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object for file upload
    const formData = new FormData();
    Object.keys(input).forEach((key) => {
      if (input[key]) formData.append(key, input[key]);
    });

    // Add skills to FormData
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
        navigate("/profile"); // Redirect back to profile page after successful update
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Mobile header - Only shown on mobile */}
      {isMobile && (
        <div className="sticky top-0 z-10 p-4 bg-background border-b shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/profile")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-bold text-lg">Edit Profile</h1>
            <div className="w-8"></div> {/* Spacer for alignment */}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
        {/* Desktop back button - Hidden on mobile */}
        {!isMobile && (
          <div className="mb-6">
            <Button
              variant="outline"
              className="mb-4"
              onClick={() => navigate("/profile")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            {/* Profile Photo Section */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Profile Photo
                </CardTitle>
                <CardDescription className="text-sm">
                  Upload a profile photo to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4 sm:gap-6">
                  <div className="relative mb-4 sm:mb-0">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-muted"
                      />
                    ) : (
                      <UserAvatar
                        user={user}
                        className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-muted"
                        size="lg"
                      />
                    )}

                    <div className="absolute -right-2 -bottom-2 flex gap-1">
                      {previewUrl && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={handleDeletePhoto}
                          disabled={isDeletePhotoLoading}
                        >
                          {isDeletePhotoLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <div
                        className="h-8 w-8 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center cursor-pointer"
                        onClick={() =>
                          document.getElementById("profile-photo").click()
                        }
                      >
                        <Upload className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    {/* <p className="text-muted-foreground text-xs sm:text-sm">
                      Recommended: Square image, at least 300x300 pixels.
                      Maximum file size: 5MB.
                    </p> */}
                    <Input
                      id="profile-photo"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    {/* <Button
                      type="button"
                      variant="outline"
                      className="mt-3 w-full sm:w-auto"
                      onClick={() =>
                        document.getElementById("profile-photo").click()
                      }
                    >
                      Choose File
                    </Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                  Basic Information
                </CardTitle>
                <CardDescription className="text-sm">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={input.username}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={input.email}
                      onChange={handleChange}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email address cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profession">Profession</Label>
                    <Select
                      value={input.profession}
                      onValueChange={(value) =>
                        setInput({ ...input, profession: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select profession" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFESSIONS.map((profession) => (
                          <SelectItem key={profession} value={profession}>
                            {profession}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <CountrySelect
                      value={input.country}
                      onChange={(value) =>
                        setInput({ ...input, country: value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={input.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Skills</CardTitle>
                <CardDescription className="text-sm">
                  Select the skills you want to showcase on your profile
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <SkillSelector
                  selectedSkills={selectedSkills}
                  onSkillSelect={setSelectedSkills}
                />
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">
                Links
                </CardTitle>
                <CardDescription className="text-sm">
                  Add your social media and other professional profiles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                <div className="grid grid-cols-1 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      name="github"
                      value={input.github}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      value={input.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio Website</Label>
                    <Input
                      id="portfolio"
                      name="portfolio"
                      value={input.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileEdit;
