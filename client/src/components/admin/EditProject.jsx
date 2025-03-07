import{ useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/data/categories";
import TagInput from "../customUI/TagInput";
import { setSingleProject } from "@/redux/projectSlice";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const project = useSelector((state) => state.project.singleProject);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingCover, setIsDraggingCover] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [],
    category: "",
    skills: [],
    logo: null,
    cover: null,
    communicationPlatform: "",
    communicationLink: "",
    socialInstagram: "",
    socialTwitter: "",
    socialLinkedin: "",
    socialGithub: "",
    socialWebsite: "",
  });

  // Load existing project data
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        description: project.description || "",
        requirements: project.requirements || [],
        category: project.category || "",
        skills: project.skills || [],
        communicationPlatform: project.communication?.platform || "",
        communicationLink: project.communication?.link || "",
        socialInstagram: project.socialLinks?.instagram || "",
        socialTwitter: project.socialLinks?.twitter || "",
        socialLinkedin: project.socialLinks?.linkedin || "",
        socialGithub: project.socialLinks?.github || "",
        socialWebsite: project.socialLinks?.website || "",
      });

      if (project.logo) {
        setPreviewUrl(project.logo);
      }

      if (project.cover) {
        setCoverPreviewUrl(project.cover);
      }
    }
  }, [project]);

  // Fetch project if not in Redux store
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${PROJECT_API_END_POINT}/get/${id}`, {
          withCredentials: true,
        });
        if (response.data.success) {
          dispatch(setSingleProject(response.data.project));
        }
      } catch (error) {
        toast.error("Failed to fetch project details");
      }
    };

    if (!project) {
      fetchProject();
    }
  }, [id, project, dispatch]);

  // File handling functions for logo and cover
  const handleFileChange = (field) => (e) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelection(field, file);
  };

  const handleFileSelection = (field, file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, [field]: file }));
      const newPreviewUrl = URL.createObjectURL(file);

      if (field === "logo") {
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(newPreviewUrl);
      } else {
        if (coverPreviewUrl && coverPreviewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(coverPreviewUrl);
        }
        setCoverPreviewUrl(newPreviewUrl);
      }
    } else {
      toast.error("Please select an image file");
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      if (coverPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    };
  }, [previewUrl, coverPreviewUrl]);

  // Handle drag and drop functions
  const handleDragEnter = (field) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (field === "logo") setIsDragging(true);
    else setIsDraggingCover(true);
  };

  const handleDragLeave = (field) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (field === "logo") setIsDragging(false);
    else setIsDraggingCover(false);
  };

  const handleDrop = (field) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (field === "logo") setIsDragging(false);
    else setIsDraggingCover(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelection(field, file);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData();

      // Create communication and social links objects
      const communication = {
        platform: formData.communicationPlatform,
        link: formData.communicationLink,
      };

      const socialLinks = {
        instagram: formData.socialInstagram,
        twitter: formData.socialTwitter,
        linkedin: formData.socialLinkedin,
        github: formData.socialGithub,
        website: formData.socialWebsite,
      };

      // Append all fields to FormData
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          if (key === "requirements" || key === "skills") {
            form.append(key, JSON.stringify(formData[key]));
          } else if (key !== "logo" && key !== "cover") {
            form.append(key, formData[key]);
          }
        }
      });

      form.append("communication", JSON.stringify(communication));
      form.append("socialLinks", JSON.stringify(socialLinks));

      if (formData.logo) form.append("logo", formData.logo);
      if (formData.cover) form.append("cover", formData.cover);

      const response = await axios.put(
        `${PROJECT_API_END_POINT}/update/${id}`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Project updated successfully");
        
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-2 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Project</CardTitle>
            <CardDescription>
              Update your project information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter project title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your project"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Requirements *</Label>
                </div>
                <TagInput
                  value={formData.requirements}
                  onChange={(tags) =>
                    setFormData((prev) => ({ ...prev, requirements: tags }))
                  }
                  placeholder="e.g., Frontend Developer, Backend Developer, UX Designer"
                />
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Required Skills</Label>
                </div>
                <TagInput
                  value={formData.skills}
                  onChange={(tags) =>
                    setFormData((prev) => ({ ...prev, skills: tags }))
                  }
                  placeholder="e.g., React, Node.js, TypeScript, UI/UX"
                />
              </div>

              {/* Logo Upload */}
              <div className="space-y-4">
                <Label>Project Logo</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border",
                    "hover:border-primary/50"
                  )}
                  onDragEnter={handleDragEnter("logo")}
                  onDragOver={handleDragEnter("logo")}
                  onDragLeave={handleDragLeave("logo")}
                  onDrop={handleDrop("logo")}
                >
                  {previewUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={previewUrl}
                        alt="Logo preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Input
                          type="file"
                          className="hidden"
                          id="fileInput"
                          onChange={handleFileChange("logo")}
                          accept="image/*"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          }
                        >
                          Change Logo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <Input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange("logo")}
                        accept="image/*"
                      />
                      <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                        <br />
                        SVG, PNG, JPG or GIF (max. 800x400px)
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-4">
                <Label>Project Cover Image</Label>
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-6 transition-colors",
                    isDraggingCover
                      ? "border-primary bg-primary/5"
                      : "border-border",
                    "hover:border-primary/50"
                  )}
                  onDragEnter={handleDragEnter("cover")}
                  onDragOver={handleDragEnter("cover")}
                  onDragLeave={handleDragLeave("cover")}
                  onDrop={handleDrop("cover")}
                >
                  {coverPreviewUrl ? (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={coverPreviewUrl}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Input
                          type="file"
                          className="hidden"
                          id="coverInput"
                          onChange={handleFileChange("cover")}
                          accept="image/*"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            document.getElementById("coverInput").click()
                          }
                        >
                          Change Cover Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <Input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange("cover")}
                        accept="image/*"
                      />
                      <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center">
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                        <br />
                        SVG, PNG, JPG or GIF (recommended: 1200x630px)
                      </p>
                    </label>
                  )}
                </div>
              </div>

              {/* Communication Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Communication</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <Input
                      name="communicationPlatform"
                      value={formData.communicationPlatform}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          communicationPlatform: e.target.value,
                        }))
                      }
                      placeholder="e.g., Slack, Discord"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Link</Label>
                    <Input
                      name="communicationLink"
                      value={formData.communicationLink}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          communicationLink: e.target.value,
                        }))
                      }
                      placeholder="Communication platform link"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input
                      name="socialInstagram"
                      value={formData.socialInstagram}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialInstagram: e.target.value,
                        }))
                      }
                      placeholder="Instagram profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter</Label>
                    <Input
                      name="socialTwitter"
                      value={formData.socialTwitter}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialTwitter: e.target.value,
                        }))
                      }
                      placeholder="Twitter profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      name="socialLinkedin"
                      value={formData.socialLinkedin}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialLinkedin: e.target.value,
                        }))
                      }
                      placeholder="LinkedIn profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>GitHub</Label>
                    <Input
                      name="socialGithub"
                      value={formData.socialGithub}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialGithub: e.target.value,
                        }))
                      }
                      placeholder="GitHub profile URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      name="socialWebsite"
                      value={formData.socialWebsite}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          socialWebsite: e.target.value,
                        }))
                      }
                      placeholder="Project website URL"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Project...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Update Project
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProject;
