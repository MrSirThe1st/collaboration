import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AdminProjectsTable from "./AdminProjectsTable";
import useGetAllAdminProjects from "@/hooks/useGetAllAdminProjects";
import { setSearchProjectByText } from "@/redux/projectSlice";

const group = () => {
  useGetAllAdminProjects();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchProjectByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/projects/create")}>
            New Project
          </Button>
        </div>
        <AdminProjectsTable />
      </div>
    </div>
  );
}


export default group;
