import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";

const RequestedProjectTable = () => {
  const { allRequestedProjects = [] } = useSelector((store) => store.project);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>project Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allRequestedProjects.length <= 0 ? (
            <span>You haven't applied any project yet.</span>
          ) : (
            allRequestedProjects.map((requestedProject) => (
              <TableRow key={requestedProject._id}>
                <TableCell>
                  {requestedProject?.createdAt?.split("T")[0]}
                </TableCell>
                <TableCell>{requestedProject.project?.title}</TableCell>
                <TableCell>{requestedProject.project?.group?.name}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    className={`${
                      requestedProject?.status === "rejected"
                        ? "bg-red-400"
                        : requestedProject.status === "pending"
                        ? "bg-gray-400"
                        : "bg-green-400"
                    }`}
                  >
                    {requestedProject.status.toUpperCase()}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RequestedProjectTable;
