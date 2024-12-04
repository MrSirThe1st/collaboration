import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea"; // Add this import
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import useGetGroupById from "@/hooks/useGetGroupById";
import { setSingleGroup } from "@/redux/groupSlice";

const GroupSetup = () => {
  const params = useParams();
  const dispatch = useDispatch();
  useGetGroupById(params.id);

  const [input, setInput] = useState({
    name: "",
    file: null,
    status: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const { singleGroup } = useSelector((store) => store.group);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is authorized to edit
  useEffect(() => {
    if (singleGroup && user && singleGroup.userId !== user._id) {
      toast.error("You don't have permission to edit this group");
      navigate("/workspace");
    }
  }, [singleGroup, user, navigate]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setPreviewImage(previewURL);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.name.trim()) {
      toast.error("Group name is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", input.name);
    formData.append("status", input.status);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API_END_POINT}/update/${params.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setSingleGroup(res.data.group));
        toast.success(res.data.message);
        navigate("/workspace");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  // Update form when group data is loaded
  useEffect(() => {
    if (singleGroup) {
      setInput({
        name: singleGroup.name || "",
        status: singleGroup.status || "",
        file: null,
      });
      setPreviewImage(singleGroup.cover);
    }
  }, [singleGroup]);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewImage && previewImage !== singleGroup?.cover) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      <form onSubmit={submitHandler} className="space-y-8">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/workspace")}
              variant="outline"
              type="button"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">Update Group Information</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name *</Label>
            <Input
              id="name"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={input.status}
              onChange={changeEventHandler}
              className="w-full p-2 rounded-md border"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-4 md:col-span-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/workspace")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Group"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GroupSetup;
