import React, { useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllGroups from "@/hooks/useGetAllGroups";

const GroupsCardLayout = () => {
  const { groups, searchGroupByText } = useSelector((store) => store.group);
  const [filterGroup, setFilterGroup] = useState(groups);
  useGetAllGroups();

  const navigate = useNavigate();

  useEffect(() => {
    const filteredGroup =
      groups.length >= 0 &&
      groups.filter((group) => {
        if (!searchGroupByText) return true;
        return group?.name
          ?.toLowerCase()
          .includes(searchGroupByText.toLowerCase());
      });
    setFilterGroup(filteredGroup);
  }, [groups, searchGroupByText]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filterGroup?.map((group) => (
        <div
          key={group._id}
          className="flex shadow-lg rounded-lg overflow-hidden cursor-pointer"
          onClick={() => navigate(`/admin/group/${group._id}`)}
        >
          {/* Left Section: cover and Name */}
          <div className="bg-muted/40 flex flex-col items-center justify-center p-4 w-1/3">
            <Avatar className="mb-4">
              <AvatarImage src={group.cover} alt={group.name} />
            </Avatar>
          </div>

          {/* Right Section: Additional Info and Actions */}
          <div className=" flex flex-col justify-between p-4 w-2/3">
            <div>
              <p className="text-sm  mb-2">{group.name}</p>
              <p className="text-sm  mb-2">
                Created At: {group.createdAt.split("T")[0]}
              </p>
              <p className="text-sm  mb-4">
                Status: {group.status || "Active"}
              </p>
            </div>

            <div className="flex justify-end">
              <Popover>
                <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-32">
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/profile/${group._id}`);
                    }}
                    className="flex items-center gap-2 w-full cursor-pointer"
                  >
                    <Edit2 className="w-4" />
                    <span>Edit</span>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupsCardLayout;
