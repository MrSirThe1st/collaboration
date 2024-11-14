import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleGroup } from "@/redux/groupSlice";
import { useSelector } from "react-redux";

const GroupCreate = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [cover, setCover] = useState(null); // New state for cover
  const dispatch = useDispatch();

  const registerNewGroup = async () => {
    try {
      const formData = new FormData(); 
      formData.append("name", groupName);
      if (cover) {
        formData.append("file", cover); 
      }

      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleGroup(res.data.group));
        toast.success(res.data.message);
        navigate("/workspace");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create group. Please try again."); // Error handling
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    setCover(file); // Update cover state
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="my-10">
        <h1 className="font-bold text-2xl">Your group Name</h1>
        <p className="text-gray-500">You can change this later.</p>
      </div>

      <Label>Group Name</Label>
      <Input
        type="text"
        className="my-2"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <Label>cover</Label>
      <Input
        type="file"
        accept="image/*"
        onChange={handleCoverChange}
        className="my-2"
      />

      <div className="flex items-center gap-2 my-10">
        <Button variant="outline" onClick={() => navigate("/profil")}>
          Cancel
        </Button>
        <Button onClick={registerNewGroup}>Create</Button>
      </div>
    </div>
  );
};

export default GroupCreate;
