import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import useGetAllAdminProjects from "@/hooks/useGetAllAdminProjects";
import { INVITATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";

const UserDetail = () => {
  const { state } = useLocation();
  const { user } = state;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState(""); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [availableRoles, setAvailableRoles] = useState([]);

  useGetAllAdminProjects();
  const { allAdminProjects } = useSelector((state) => state.project);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (selectedProject) {
      const project = allAdminProjects.find((p) => p._id === selectedProject);
      setAvailableRoles(project ? project.requirements : []);
      setSelectedRole("");
    }
  }, [selectedProject, allAdminProjects]);

  const handleInvite = async () => {
    if (!selectedProject || !selectedRole || !message) return;

    try {
      const response = await axios.post(
        `${INVITATION_API_END_POINT}/create`,
        {
          recipientId: user._id,
          projectId: selectedProject,
          role: selectedRole,
          message,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        console.log("Invitation sent successfully");
        setIsDialogOpen(false);
        setCurrentStep(1);
        setSelectedProject("");
        setSelectedRole("");
        setMessage("");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.message || "Error sending invitation");
      } else {
        console.error("Error sending invitation:", error.message);
        toast.error("Network error or server is unavailable");
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedProject) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedRole) {
      setCurrentStep(3); 
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleViewProfile = () => {
    navigate("/profile");
  };

  return (
    <div>
      <div className="container mx-auto my-10">
        <div className="p-4 border rounded">
          {currentUser && user._id === currentUser._id ? (
            <Button onClick={handleViewProfile}>View Profile</Button>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>Invite</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {currentStep === 1
                      ? "Select Project"
                      : currentStep === 2
                      ? "Select Role"
                      : "Type a Message"}
                  </DialogTitle>
                </DialogHeader>
                {currentStep === 1 ? (
                  <>
                    <Select onValueChange={setSelectedProject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {allAdminProjects?.map((project) => (
                          <SelectItem key={project._id} value={project._id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleNextStep}
                      disabled={!selectedProject}
                    >
                      Next
                    </Button>
                  </>
                ) : currentStep === 2 ? (
                  <>
                    <Select onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex justify-between">
                      <Button onClick={handlePreviousStep}>Back</Button>
                      <Button onClick={handleNextStep} disabled={!selectedRole}>
                        Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <textarea
                      className="w-full p-2 border rounded"
                      rows="5"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                    <div className="flex justify-between">
                      <Button onClick={handlePreviousStep}>Back</Button>
                      <Button onClick={handleInvite} disabled={!message}>
                        Send Invitation
                      </Button>
                    </div>
                  </>
                )}
              </DialogContent>
            </Dialog>
          )}

          <img
            src={user.profile.profilePhoto}
            alt={user.username}
            className="w-32 h-32 rounded-full mx-auto"
          />
          <h3 className="text-xl font-bold text-center mt-4">
            {user.username}
          </h3>
          <p className="text-center">{user.profession}</p>
          <p className="text-center mt-2">{user.profile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
