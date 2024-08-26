import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  APPLICATION_API_END_POINT,
  COMPANY_API_END_POINT,
} from "@/utils/constant";
import axios from "axios";
import { useLocation } from "react-router-dom";

const shortlistingStatus = ["Accepted", "Rejected"];

const RequestersTable = () => {
  const { requesters } = useSelector((store) => store.request);
  const location = useLocation();
  const { groupId } = location.state;

  const statusHandler = async (status, requestId, userId) => {
    try {
      axios.defaults.withCredentials = true;

      // Update status
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${requestId}/update`,
        { status }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        if (status === "Accepted") {
          // Fetch group to ensure it exists
          const resGroup = await axios.get(
            `${COMPANY_API_END_POINT}/get/${groupId}`
          );

          // Verify if the groupId is valid
          if (resGroup.data.group._id) {
            // Add member to the group with userId
            const resAddMember = await axios.post(
              `${COMPANY_API_END_POINT}/addMember/${groupId}`,
              { userId } // Pass userId in the request body
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
    <div>
      <Table>
        <TableCaption>A list of your recent applied users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>FullName</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Resume</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requesters &&
            requesters?.requests?.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item?.requester?.username}</TableCell>
                <TableCell>{item?.requester?.email}</TableCell>
                <TableCell>{item?.requester?.phoneNumber}</TableCell>
                <TableCell>
                  {item.requester?.profile?.resume ? (
                    <a
                      className="text-blue-600 cursor-pointer"
                      href={item?.requester?.profile?.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item?.requester?.profile?.resumeOriginalName}
                    </a>
                  ) : (
                    <span>NA</span>
                  )}
                </TableCell>
                <TableCell>{item?.requester.createdAt.split("T")[0]}</TableCell>
                <TableCell className="float-right cursor-pointer">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                      {shortlistingStatus.map((status, index) => {
                        return (
                          <div
                            onClick={
                              () =>
                                statusHandler(
                                  status,
                                  item._id,
                                  item?.requester?._id
                                ) // Pass requestId and userId
                            }
                            key={index}
                            className="flex w-fit items-center my-2 cursor-pointer"
                          >
                            <span>{status}</span>
                          </div>
                        );
                      })}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestersTable;
