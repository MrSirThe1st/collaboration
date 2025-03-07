import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useDispatch } from "react-redux";
import { setSingleGroup } from "@/redux/groupSlice";
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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const GroupCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cover: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handle regular input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  // Handle file selection (used by both drop and input)
  const handleFileSelection = (file) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({
        ...prev,
        cover: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append("name", formData.name);
      if (formData.description) {
        submitData.append("description", formData.description);
      }
      if (formData.cover) {
        submitData.append("file", formData.cover);
      }

      const response = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        submitData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setSingleGroup(response.data.group));
        toast.success(response.data.message);
        navigate("/workspace");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setIsSubmitting(false);
    }
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 flex items-center justify-center bg-card rounded-lg shadow-lg animate-pulse">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
      <p className="text-lg font-medium animate-pulse">
        Creating your group...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-2 px-4">
      {isSubmitting && <LoadingOverlay />}
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create New Group</CardTitle>
            <CardDescription>
              Create a new group to manage your projects and members
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Group Name Input */}
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your group name"
                  required
                />
              </div>

              {/* Group Description */}
              {/* <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your group's purpose"
                  rows={4}
                />
              </div> */}

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
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
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        {/* Remove the label wrapper as it's blocking the click event */}
                        <Input
                          type="file"
                          className="hidden"
                          id="fileInput" // Add an ID for reference
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            document.getElementById("fileInput").click()
                          } // Directly trigger the input click
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

              {/* Submit Button */}
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
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Create Group
                  </>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GroupCreate;
