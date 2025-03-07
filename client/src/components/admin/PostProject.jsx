import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useEffect } from "react";
import { CATEGORIES } from "@/data/categories";
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
import {
  ArrowLeft,
  Upload,
  Loader2,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

import TagInput from "../customUI/TagInput";
import useGetAllGroups from "@/hooks/useGetAllGroups";
import CountrySelect from "../ProjectMessages/components/CountrySelect";
import { countries } from "countries-list";

const PostProject = () => {
  const navigate = useNavigate();
  const { groups } = useSelector((store) => store.group);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isGlobal, setIsGlobal] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");

  useGetAllGroups();

  const hasGroups = groups && groups.length > 0;

  useEffect(() => {
    const savedData = localStorage.getItem("projectFormData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Only restore if the selected group still exists
      if (
        parsedData.groupId &&
        groups.some((g) => g._id === parsedData.groupId)
      ) {
        setFormData(parsedData);
      }
    }
  }, [groups]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [],
    groupId: "",
    logo: null,
    cover: null,
    category: "",
    skills: [],
    communicationPlatform: "",
    communicationLink: "",
    socialInstagram: "",
    socialTwitter: "",
    socialLinkedin: "",
    socialGithub: "",
    socialWebsite: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);
    localStorage.setItem("projectFormData", JSON.stringify(newFormData));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleCoverSelection(file);
    }
  };

  const handleCoverSelection = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        cover: file,
      }));
      const newPreviewUrl = URL.createObjectURL(file);
      if (coverPreviewUrl) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
      setCoverPreviewUrl(newPreviewUrl);
    } else {
      toast.error("Please select an image file");
    }
  };

  // Handle cover drag and drop
  const handleCoverDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(true);
  };

  const handleCoverDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingCover(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleCoverSelection(file);
    }
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // Handle file selection
  const handleFileSelection = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
      const newPreviewUrl = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(newPreviewUrl);
    } else {
      toast.error("Please select an image file");
    }
  };

  // Handle drag and drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const form = new FormData();

      // Create communication and social links objects
      const communication = {
        platform: formData.communicationPlatform || "",
        link: formData.communicationLink || "",
      };

      const socialLinks = {
        instagram: formData.socialInstagram || "",
        twitter: formData.socialTwitter || "",
        linkedin: formData.socialLinkedin || "",
        github: formData.socialGithub || "",
        website: formData.socialWebsite || "",
      };

      const countryRestriction = {
        isGlobal,
        country:
          !isGlobal && selectedCountry
            ? {
                code: selectedCountry,
                name: countries[selectedCountry]?.name || "",
              }
            : null,
      };

      // Append all fields to FormData
      form.append("title", formData.title);
      form.append("description", formData.description);
      form.append("requirements", JSON.stringify(formData.requirements));
      form.append("skills", JSON.stringify(formData.skills));
      form.append("groupId", formData.groupId);
      form.append("category", formData.category);
      form.append("communication", JSON.stringify(communication));
      form.append("socialLinks", JSON.stringify(socialLinks));
      form.append("countryRestriction", JSON.stringify(countryRestriction));

      // Handle file uploads
      if (formData.logo) {
        form.append("logo", formData.logo);
      }

      if (formData.cover) {
        form.append("cover", formData.cover);
      }

      const response = await axios.post(`${PROJECT_API_END_POINT}/post`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.success) {
        localStorage.removeItem("projectFormData");
        toast.success(response.data.message);
        navigate(`/admin/group/${formData.groupId}`);
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {!hasGroups ? (
          <Card>
            <CardHeader>
              <CardTitle>Create a Group First</CardTitle>
              <CardDescription>
                You need to create a group before you can create a project
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Projects need to be associated with a group. Create your first
                  group to get started.
                </p>
                <Button
                  onClick={() => navigate("/admin/create")}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Group
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create a Group First</CardTitle>
              <CardDescription>
                You need to create or join a group before you can create a
                project
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
                        onChange={handleInputChange}
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
                      onChange={handleInputChange}
                      placeholder="Describe your project"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Project Availability</Label>
                    <Select
                      value={isGlobal ? "global" : "country"}
                      onValueChange={(value) => {
                        if (value === "global") {
                          setSelectedCountry("");
                        }
                        setIsGlobal(value === "global");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">
                          Global (Everyone)
                        </SelectItem>
                        <SelectItem value="country">
                          Specific Country
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    {!isGlobal && (
                      <div className="mt-4">
                        <Label>Select Country</Label>
                        <CountrySelect
                          value={selectedCountry}
                          onChange={(value) => setSelectedCountry(value)}
                          required={!isGlobal}
                        />
                      </div>
                    )}
                  </div>
                </div>
                {/* Group Selection */}
                <div className="space-y-4">
                  <Label htmlFor="groupId">Group *</Label>
                  <Select
                    value={formData.groupId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, groupId: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group._id} value={group._id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    placeholder="e.g., Frontend_Developer, Backend_Developer, UX_Designer"
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
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
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
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            Change Image
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center gap-2 cursor-pointer">
                        <Input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
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
                    onDragEnter={handleCoverDragEnter}
                    onDragOver={handleCoverDragEnter}
                    onDragLeave={handleCoverDragLeave}
                    onDrop={handleCoverDrop}
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
                            onChange={handleCoverChange}
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
                          onChange={handleCoverChange}
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
                {/* Communication Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Communication</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Input
                        name="communicationPlatform"
                        value={formData.communicationPlatform}
                        onChange={handleInputChange}
                        placeholder="e.g., Slack, Discord"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Link</Label>
                      <Input
                        name="communicationLink"
                        value={formData.communicationLink}
                        onChange={handleInputChange}
                        placeholder="platform link"
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
                        onChange={handleInputChange}
                        placeholder="Instagram profile URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter</Label>
                      <Input
                        name="socialTwitter"
                        value={formData.socialTwitter}
                        onChange={handleInputChange}
                        placeholder="Twitter profile URL"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <Label>LinkedIn</Label>
                      <Input
                        name="socialLinkedin"
                        value={formData.socialLinkedin}
                        onChange={handleInputChange}
                        placeholder="LinkedIn profile URL"
                      />
                    </div> */}
                    <div className="space-y-2">
                      <Label>GitHub</Label>
                      <Input
                        name="socialGithub"
                        value={formData.socialGithub}
                        onChange={handleInputChange}
                        placeholder="GitHub profile URL"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Website</Label>
                      <Input
                        name="socialWebsite"
                        value={formData.socialWebsite}
                        onChange={handleInputChange}
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
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Project...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Create Project
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PostProject;
