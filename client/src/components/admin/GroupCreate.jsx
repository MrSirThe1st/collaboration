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

const GroupCreate = () => {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState();
  const dispatch = useDispatch();
  const registerNewGroup = async () => {
    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { name: groupName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res?.data?.success) {
        dispatch(setSingleGroup(res.data.group));
        toast.success(res.data.message);
        const groupId = res?.data?.group?._id;
        navigate(`/profile/${groupId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Your group Name</h1>
          <p className="text-gray-500">
            What would you like to give your group name? you can change this
            later.
          </p>
        </div>

        <Label>group Name</Label>
        <Input
          type="text"
          className="my-2"
          placeholder="JobHunt, Microsoft etc."
          value={groupName || ""}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="flex items-center gap-2 my-10">
          <Button variant="outline" onClick={() => navigate("/profil")}>
            Cancel
          </Button>
          <Button onClick={registerNewGroup}>Continue</Button>
        </div>
      </div>
    </div>
  );
};

export default GroupCreate;
