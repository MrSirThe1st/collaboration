import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AdminProjectsTable from "./AdminProjectsTable";
import {
  setSearchProjectByText,
  updateProjectMember,
} from "@/redux/projectSlice";
import useFetchGroupMembers from "@/hooks/useFetchGroupMembers";
import useGetAllAdminProjects from "@/hooks/useGetAllAdminProjects";
import useGetGroupById from "@/hooks/useGetGroupById";
import { PROJECT_API_END_POINT } from "@/utils/constant";

const Group = () => {
  const { id } = useParams();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [memberSelections, setMemberSelections] = useState({});

  useFetchGroupMembers(id);
  useGetGroupById(id);
  useGetAllAdminProjects();

  const { members } = useSelector((state) => state.group);
  const { allAdminProjects } = useSelector((state) => state.project);
  const { singleGroup } = useSelector((state) => state.group);

  useEffect(() => {
    dispatch(setSearchProjectByText(input));
  }, [input, dispatch]);

  const assignMemberToProject = async (projectId, memberId, role) => {
    try {
      const response = await axios.post(
        `${PROJECT_API_END_POINT}/assign-member`,
        { projectId, memberId, role },
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log("Member assigned successfully");
        dispatch(updateProjectMember({ projectId, memberId, role }));
        setMemberSelections((prev) => {
          const newSelections = { ...prev };
          delete newSelections[memberId];
          return newSelections;
        });
      }
    } catch (error) {
      console.error("Error assigning member to project:", error);
    }
  };

  const handleAssign = (memberId) => {
    const { selectedProject, selectedRole } = memberSelections[memberId] || {};
    if (selectedProject && selectedRole) {
      assignMemberToProject(selectedProject, memberId, selectedRole);
    } else {
      console.error("Missing project or role selection");
    }
  };

  const handleSelectionChange = (memberId, field, value) => {
    setMemberSelections((prevSelections) => ({
      ...prevSelections,
      [memberId]: {
        ...prevSelections[memberId],
        [field]: value,
      },
    }));
  };

  const getAssignedMembers = (projects) => {
    const assignedMembers = new Set();
    projects.forEach((project) => {
      project.members.forEach((member) => {
        assignedMembers.add(member.user);
      });
    });
    return assignedMembers;
  };

  const assignedMembers = getAssignedMembers(allAdminProjects);

  const filteredMembers = members.filter(
    (member) => !assignedMembers.has(member._id)
  );

  if (!members || !allAdminProjects || !singleGroup) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="max-w-6xl mx-auto my-10">
        <div className="flex items-center justify-between my-5">
          <Input
            className="w-fit"
            placeholder="Filter by name, role"
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => navigate("/admin/projects/create")}>
            Add a Project
          </Button>
        </div>

        {singleGroup && (
          <div className="my-5">
            <div className="flex items-center space-x-4">
              <img
                src={singleGroup.cover || "default-group-logo.png"}
                alt={singleGroup.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold">{singleGroup.name}</h1>
                <p className="text-sm text-gray-500">
                  Status: {singleGroup.status}
                </p>
                <p className="mt-2 ">{singleGroup.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="my-5">
          <h2 className="text-lg font-semibold">Group Members</h2>
          {filteredMembers.length > 0 ? (
            <ul>
              {filteredMembers.map((member) => (
                <li
                  key={member._id}
                  className="flex items-center space-x-4 my-4 p-4 border rounded-lg"
                >
                  <img
                    src={member.profile?.profilePhoto || "default-avatar.png"}
                    alt={member.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{member.username}</p>
                    <p className="text-sm text-gray-500">{member.profession}</p>
                  </div>

                  <div className="flex ">
                    <div className="m-4 w-full">
                      <select
                        value={
                          memberSelections[member._id]?.selectedProject || ""
                        }
                        onChange={(e) =>
                          handleSelectionChange(
                            member._id,
                            "selectedProject",
                            e.target.value
                          )
                        }
                        className="w-full"
                      >
                        <option value="">Select Project</option>
                        {allAdminProjects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="m-4 w-full">
                      <select
                        value={memberSelections[member._id]?.selectedRole || ""}
                        onChange={(e) =>
                          handleSelectionChange(
                            member._id,
                            "selectedRole",
                            e.target.value
                          )
                        }
                        className="w-full"
                      >
                        <option value="">Select Role</option>
                        {memberSelections[member._id]?.selectedProject &&
                          allAdminProjects
                            .find(
                              (p) =>
                                p._id ===
                                memberSelections[member._id]?.selectedProject
                            )
                            ?.requirements.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                      </select>
                    </div>
                    <Button
                      onClick={() => handleAssign(member._id)}
                      className="w-full"
                    >
                      Assign Member
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No members available for assignment.</p>
          )}
        </div>

        <div className="my-5">
          <AdminProjectsTable />
        </div>
      </div>
    </div>
  );
};

export default Group;
