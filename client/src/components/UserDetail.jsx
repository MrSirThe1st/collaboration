import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
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
  Globe,
  Loader,
} from "lucide-react";
import useGetAllAdminProjects from "@/hooks/useGetAllAdminProjects";
import { INVITATION_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import MessageButton from "./ProjectMessages/components/MessageButton";
import Flag from "react-world-flags";
import UserAvatar from "./customUI/UserAvatar";

const UserDetail = () => {
  const { state } = useLocation();
  const { user } = state;
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatRole = (role) => {
    return role.replace(/["[\]]/g, "").trim();
  };

  useGetAllAdminProjects();
  const { allAdminProjects } = useSelector((state) => state.project);

  useEffect(() => {
    if (allAdminProjects) {
      setIsLoading(false); 
    }
  }, [allAdminProjects]); 

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
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className=" rounded-2xl shadow-lg overflow-hidden">
            {/* Gradient background */}
            <div className="h-24 sm:h-40 bg-gradient-to-r from-primary/20 to-primary/10 relative overflow-hidden">
              {/* Flag pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 sm:grid-cols-12 gap-1 p-1">
                  {Array(48)
                    .fill(user.profile?.country?.code)
                    .map((code, i) => (
                      <Flag
                        key={i}
                        code={code}
                        className="w-full h-full object-cover "
                      />
                    ))}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-8 pb-8 relative">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                {/* Profile Image */}
                <div className="relative -mt-12 sm:-mt-20 shrink-0">
                  <UserAvatar
                    user={user}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-lg"
                    showStatus
                  />
                </div>

                {/* User Info */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 py-2">
                    <div className="flex-1">
                      <h1 className="text-lg sm:text-xl font-bold">
                        {user.username}
                      </h1>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        <Briefcase className="w-4 h-4 shrink-0" />
                        <span>{user.profession}</span>
                      </div>
                      {/* <div className="flex items-center gap-2 mt-1 text-sm">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span>Status: {user.status}</span>
                      </div>
                      {user.profile?.country && (
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <Flag
                            code={user.profile.country.code}
                            className="h-4 w-6 object-cover"
                          />
                          <span>{user.profile.country.name}</span>
                        </div>
                      )} */}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      {!(currentUser && user._id === currentUser._id) && (
                        <MessageButton
                          className="w-full sm:w-auto"
                          userId={user._id}
                          username={user.username}
                          profile={user.profile}
                        />
                      )}
                      {currentUser && user._id === currentUser._id ? (
                        <Button
                          className="w-full sm:w-auto"
                          onClick={handleViewProfile}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <Dialog
                          open={isDialogOpen}
                          onOpenChange={setIsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full sm:w-auto"
                            >
                              Invite to Project
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95%] max-w-[425px]">
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
                                  {allAdminProjects?.length === 0 ? (
                                    <div className="text-center py-6">
                                      <h3 className="font-medium text-lg mb-2">
                                        No Projects Available
                                      </h3>
                                      <p className="text-muted-foreground text-sm mb-4">
                                        You need to create a project before you
                                        can invite team members.
                                      </p>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setIsDialogOpen(false);
                                          navigate("/admin/projects/create");
                                        }}
                                      >
                                        Create Your First Project
                                      </Button>
                                    </div>
                                  ) : (
                                    <>
                                      <Select
                                        onValueChange={setSelectedProject}
                                      >
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
                                  )}
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

              {/* Bio Section */}
              {user.profile.bio && (
                <div className="mt-4 sm:mt-6">
                  <h2 className="text-base sm:text-lg font-semibold mb-2">
                    About
                  </h2>
                  <p className="text-xs sm:text-sm">{user.profile.bio}</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills and Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
            {/* Skills Section */}
            <div className=" rounded-xl shadow-lg overflow-hidden p-4 sm:p-6 md:col-span-2">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.profile.skills.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs sm:text-sm"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="e rounded-xl shadow-lg overflow-hidden p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold mb-4">
                Contact
              </h2>
              <div className="space-y-3">
                <a
                  href={`mailto:${user.email}`}
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">Email</span>
                </a>
                <a
                  href={user.profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Linkedin className="w-4 h-4 shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </a>
                <a
                  href={user.profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Github className="w-4 h-4 shrink-0" />
                  <span className="truncate">GitHub</span>
                </a>
                <a
                  href={user.profile.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">Portfolio</span>
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
