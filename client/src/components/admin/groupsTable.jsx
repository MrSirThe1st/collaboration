import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const GroupsTable = () => {
  const { groups, searchGroupByText } = useSelector((store) => store.group);
  const [filterGroup, setFilterGroup] = useState(groups);
  const navigate = useNavigate();
  useEffect(() => {
    const filteredGroup =
      groups.length >= 0 &&
      groups.filter((group) => {
        if (!searchGroupByText) {
          return true;
        }
        return group?.name
          ?.toLowerCase()
          .includes(searchGroupByText.toLowerCase());
      });
    setFilterGroup(filteredGroup);
  }, [groups, searchGroupByText]);
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent registered groups</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterGroup?.map((group) => (
            <tr>
              <TableCell>
                <Avatar>
                  <AvatarImage src={group.logo} />
                </Avatar>
              </TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/profile/${group._id}`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() => navigate(`/admin/group/${group._id}`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Users className="w-4" />
                      <span>View</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default GroupsTable;
