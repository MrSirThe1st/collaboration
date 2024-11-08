import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateProjectMember, setAllAdminProjects } from "@/redux/projectSlice";
import { setMembers, setSingleGroup } from "@/redux/groupSlice";
import {
  PROJECT_API_END_POINT,
  COMPANY_API_END_POINT,
  APPLICATION_API_END_POINT,
} from "@/utils/constant";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Group = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectRequests, setProjectRequests] = useState({});
  const [requesters, setRequesters] = useState({});
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleGroup } = useSelector((state) => state.group);
  const { allAdminProjects } = useSelector((state) => state.project);

  const fetchRequesterInfo = async (userId) => {
    try {
      if (!userId) {
        console.error("No userId provided to fetchRequesterInfo");
        return null;
      }

      const response = await axios.get(
        `${PROJECT_API_END_POINT}/users/${userId}`,
        {
          withCredentials: true,
        }
      );
      return response.data.user;
    } catch (error) {
      console.error(
        `Error fetching requester info for userId ${userId}:`,
        error
      );
      return null;
    }
  };

  const handleRequestStatus = async (
    requestId,
    newStatus,
    projectId,
    request
  ) => {
    try {
      if (newStatus === "accepted") {
        setSelectedRequest({ requestId, projectId, request });
        setIsRoleDialogOpen(true);
        return;
      }

      const response = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${requestId}/update`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        setProjectRequests((prev) => ({
          ...prev,
          [projectId]: prev[projectId].map((req) =>
            req._id === requestId ? { ...req, status: newStatus } : req
          ),
        }));
        toast.success("Request rejected successfully");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast.error("Failed to update request status");
    }
  };

  const handleAcceptWithRole = async () => {
    if (!selectedRequest || !selectedRole) {
      toast.error("Please select a role");
      return;
    }

    try {
      const statusResponse = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${selectedRequest.requestId}/update`,
        { status: "accepted" },
        { withCredentials: true }
      );

      if (statusResponse.data.success) {
        const assignResponse = await axios.post(
          `${PROJECT_API_END_POINT}/assign-member`,
          {
            projectId: selectedRequest.projectId,
            memberId:
              selectedRequest.request.requester?._id ||
              selectedRequest.request.requester,
            role: selectedRole,
          },
          { withCredentials: true }
        );

        if (assignResponse.data.success) {
          setProjectRequests((prev) => ({
            ...prev,
            [selectedRequest.projectId]: prev[selectedRequest.projectId].map(
              (req) =>
                req._id === selectedRequest.requestId
                  ? { ...req, status: "accepted" }
                  : req
            ),
          }));

          toast.success("Member assigned successfully");
          setIsRoleDialogOpen(false);
          setSelectedRole("");
          setSelectedRequest(null);
        }
      }
    } catch (error) {
      console.error("Error in acceptance process:", error);
      toast.error("Failed to assign member to project");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);

      try {
        const [groupResponse, projectsResponse] = await Promise.all([
          axios.get(`${COMPANY_API_END_POINT}/get/${id}`, {
            withCredentials: true,
          }),
          axios.get(`${PROJECT_API_END_POINT}/getadminprojects`, {
            withCredentials: true,
          }),
        ]);

        if (groupResponse.data.success) {
          dispatch(setSingleGroup(groupResponse.data.group));
          dispatch(setMembers(groupResponse.data.group.members));
        }

        if (projectsResponse.data.success) {
          const groupProjects = projectsResponse.data.projects.filter(
            (project) => project.group?._id === id || project.group === id
          );
          dispatch(setAllAdminProjects(groupProjects));

          const requestsData = {};
          const requestersInfo = {};

          await Promise.all(
            groupProjects.map(async (project) => {
              if (project.requests?.length > 0) {
                try {
                  const requestResponse = await axios.get(
                    `${APPLICATION_API_END_POINT}/${project._id}/requesters`,
                    { withCredentials: true }
                  );

                  if (requestResponse.data.success) {
                    requestsData[project._id] =
                      requestResponse.data.project.requests;

                    await Promise.all(
                      requestResponse.data.project.requests.map(
                        async (request) => {
                          const requesterId =
                            request.requester?._id || request.requester;
                          if (!requestersInfo[requesterId]) {
                            const requesterData = await fetchRequesterInfo(
                              requesterId
                            );
                            if (requesterData) {
                              requestersInfo[requesterId] = requesterData;
                            }
                          }
                        }
                      )
                    );
                  }
                } catch (error) {
                  console.error(
                    `Error fetching requests for project ${project._id}:`,
                    error
                  );
                }
              }
            })
          );

          setProjectRequests(requestsData);
          setRequesters(requestersInfo);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load group data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      {singleGroup && (
        <div className="my-5 bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <img
              src={singleGroup.cover || "default-group-logo.png"}
              alt={singleGroup.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{singleGroup.name}</h1>
              <p className="text-sm text-gray-500">
                Status: {singleGroup.status}
              </p>
              <p className="mt-2">{singleGroup.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="my-8 space-y-6">
        <h2 className="text-2xl font-bold">Group Projects</h2>
        <div className="grid grid-cols-1 gap-6">
          {allAdminProjects.map((project) => (
            <Card key={project._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {project.description.substring(0, 150)}...
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/projects/${project._id}/page`)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="flex gap-4 mb-6">
                  <Badge variant="secondary">
                    {project.members.length} Members
                  </Badge>
                  <Badge variant="secondary">{project.status}</Badge>
                  <Badge variant="secondary">
                    {projectRequests[project._id]?.length || 0} Requests
                  </Badge>
                </div>

                {projectRequests[project._id]?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-4">Requests</h3>
                    <div className="space-y-4">
                      {projectRequests[project._id].map((request) => {
                        const requesterId =
                          request.requester?._id || request.requester;
                        const requester = requesters[requesterId];

                        return (
                          <div
                            key={request._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-4">
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={requester?.profile?.profilePhoto}
                                  alt={requester?.username || "User"}
                                />
                                <AvatarFallback>
                                  {requester?.username
                                    ?.slice(0, 2)
                                    .toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {requester?.username || "Loading..."}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {requester?.profession ||
                                    "No profession listed"}
                                </p>
                                <p className="text-xs text-gray-400">
                                  Status: {request.status}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {request.status === "thinking" && (
                                <>
                                  <Button
                                    variant="outline"
                                    className="bg-green-50 text-green-600 hover:bg-green-100"
                                    onClick={() =>
                                      handleRequestStatus(
                                        request._id,
                                        "accepted",
                                        project._id,
                                        request
                                      )
                                    }
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    className="bg-red-50 text-red-600 hover:bg-red-100"
                                    onClick={() =>
                                      handleRequestStatus(
                                        request._id,
                                        "rejected",
                                        project._id,
                                        request
                                      )
                                    }
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role to Member</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="">Select Role</option>
              {selectedRequest &&
                allAdminProjects
                  .find((p) => p._id === selectedRequest.projectId)
                  ?.requirements.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
            </select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRoleDialogOpen(false);
                setSelectedRole("");
                setSelectedRequest(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAcceptWithRole} disabled={!selectedRole}>
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Group;
