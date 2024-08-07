import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import GroupsTable from "./groupsTable";
import { useNavigate } from "react-router-dom";
import useGetAllGroups from "@/hooks/useGetAllGroups";
import { useDispatch } from "react-redux";
import { setSearchGroupByText } from "@/redux/groupSlice";

const Groups = () => {
  useGetAllGroups();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchGroupByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/companies/create")}>
            New Group
          </Button>
        </div>
        <GroupsTable />
      </div>
    </div>
  );
};

export default Groups;
