import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
import {
  Github,
  Linkedin,
  Mail,
  Briefcase,
  MapPin,
  Calendar,
  User,
  Bookmark,
  Clock,
  Globe,
} from "lucide-react";
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

  const formatRole = (role) => {
    return role.replace(/["\[\]]/g, "").trim();
  };

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
    <div className=" min-h-screen">
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className=" rounded-2xl shadow-lg overflow-hidden">
            <div className="h-40 bg-gradient-to-r from-primary/20 to-primary/10" />
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start relative">
                <div className="relative -mt-20">
                  <img
                    src={user.profile.profilePhoto || "/default-avatar.png"}
                    alt={user.username}
                    className="w-32 h-32 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                  <span
                    className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-white ${
                      user.status === "available"
                        ? "bg-green-500"
                        : user.status === "busy"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  />
                </div>

                <div className="flex-1 pt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold">{user.username}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{user.profession}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>Status: {user.status}</span>
                      </div>
                    </div>

                    <div>
                      {currentUser && user._id === currentUser._id ? (
                        <Button onClick={handleViewProfile}>
                          Edit Profile
                        </Button>
                      ) : (
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button>Invite to Project</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                {currentStep === 1
                                  ? "Select Project"
                                  : currentStep === 2
                                  ? "Select Role"
                                  : "Send Message"}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="mt-4">
                              {currentStep === 1 ? (
                                <>
                                  <Select onValueChange={setSelectedProject}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {allAdminProjects?.map((project) => (
                                        <SelectItem
                                          key={project._id}
                                          value={project._id}
                                        >
                                          {project.title}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <div className="mt-4 flex justify-end">
                                    <Button
                                      onClick={handleNextStep}
                                      disabled={!selectedProject}
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </>
                              ) : currentStep === 2 ? (
                                <>
                                  <Select onValueChange={setSelectedRole}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {availableRoles.map((role) => (
                                        <SelectItem
                                          key={role}
                                          value={formatRole(role)}
                                        >
                                          {formatRole(role)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <div className="mt-4 flex justify-between">
                                    <Button
                                      variant="outline"
                                      onClick={handlePreviousStep}
                                    >
                                      Back
                                    </Button>
                                    <Button
                                      onClick={handleNextStep}
                                      disabled={!selectedRole}
                                    >
                                      Next
                                    </Button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <textarea
                                    className="w-full p-2 border rounded-md bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                    rows="4"
                                    placeholder="Write your invitation message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                  />
                                  <div className="mt-4 flex justify-between">
                                    <Button
                                      variant="outline"
                                      onClick={handlePreviousStep}
                                    >
                                      Back
                                    </Button>
                                    <Button
                                      onClick={handleInvite}
                                      disabled={!message}
                                    >
                                      Send Invitation
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {user.profile.bio && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="">{user.profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className=" rounded-xl shadow-lg overflow-hidden p-6 md:col-span-2">
              <h2 className="text-lg font-semibold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className=" rounded-xl shadow-lg overflow-hidden p-6">
              <h2 className="text-lg font-semibold mb-4">Contact</h2>
              <div className="space-y-3">
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center gap-3  hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </a>
                <a
                  href={user.profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3  hover:text-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={user.profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3  hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
                <a
                  href={user.profile.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3  hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>Portfolio</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
