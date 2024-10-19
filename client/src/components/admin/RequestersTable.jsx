import React from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { MoreHorizontal, FileText, Phone, Mail, Calendar } from "lucide-react";
import {
  APPLICATION_API_END_POINT,
  COMPANY_API_END_POINT,
} from "@/utils/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const shortlistingStatus = ["Accepted", "Rejected"];

const RequestersTable = () => {
  const { requesters } = useSelector((store) => store.request);
  const location = useLocation();
  const { groupId } = location.state;

  const statusHandler = async (status, requestId, userId) => {
    try {
      axios.defaults.withCredentials = true;

      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${requestId}/update`,
        { status }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        if (status === "Accepted") {
          const resGroup = await axios.get(
            `${COMPANY_API_END_POINT}/get/${groupId}`
          );

          if (resGroup.data.group._id) {
            const resAddMember = await axios.post(
              `${COMPANY_API_END_POINT}/addMember/${groupId}`,
              { userId }
            );

            if (resAddMember.data.success) {
              toast.success("User added to the group successfully.");
            } else {
              toast.error(resAddMember.data.message);
            }
          } else {
            toast.error("Group ID is invalid.");
          }
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Requester Applications</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requesters &&
          requesters?.requests?.map((item) => (
            <Card key={item._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={item?.requester?.profile?.profilePhoto}
                      />
                      <AvatarFallback>
                        {item?.requester?.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{item?.requester?.username}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {item?.requester?.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {shortlistingStatus.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() =>
                            statusHandler(
                              status,
                              item._id,
                              item?.requester?._id
                            )
                          }
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{item?.requester?.phoneNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{item?.requester?.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      {new Date(item?.requester.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    {item.requester?.profile?.resume ? (
                      <a
                        className="text-blue-600 hover:underline"
                        href={item?.requester?.profile?.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span>Resume not available</span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <Badge variant="outline">Status: Pending</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default RequestersTable;
