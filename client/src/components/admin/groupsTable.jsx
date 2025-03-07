import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, AlertTriangle, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetAllGroups from "@/hooks/useGetAllGroups";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setGroups } from "@/redux/groupSlice";

const GroupsCardLayout = () => {
  const { groups, searchGroupByText } = useSelector((store) => store.group);
  const [filterGroup, setFilterGroup] = useState(groups);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleGroupDelete = async (group) => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${COMPANY_API_END_POINT}/delete/${group._id}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(setGroups(groups.filter((g) => g._id !== group._id)));
        toast.success("Group deleted successfully");
        setShowDeleteDialog(false);
        setGroupToDelete(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete group");
    } finally {
      setIsDeleting(false); 
    }
  };
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {filterGroup?.map((group) => (
        <div
          key={group._id}
          className="flex shadow-lg rounded-lg overflow-hidden cursor-pointer"
          onClick={() => navigate(`/admin/group/${group._id}`)}
        >
          {/* Left Section: cover and Name */}
          <div className="w-1/3 relative">
            {group.cover ? (
              <img
                src={group.cover}
                alt={group.name}
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/30 flex items-center justify-center absolute inset-0">
                <span className="text-3xl font-bold text-primary/40">
                  {group.name?.slice(0, 2)?.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Right Section: Additional Info and Actions */}
          <div className=" flex flex-col justify-between p-4 w-2/3">
            <div>
              <p className="text-sm  mb-2">{group.name}</p>
              <p className="text-sm  mb-2">
                Created on: {group.createdAt.split("T")[0]}
              </p>
            </div>

            <div className="flex justify-end">
              <Popover>
                <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="cursor-pointer" />
                </PopoverTrigger>
                <PopoverContent className="w-40">
                  <div className="flex flex-col space-y-2">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${group._id}`);
                      }}
                      className="flex items-center gap-2 w-full p-2 cursor-pointer hover:bg-muted rounded-md"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </div>

                    {group.userId === user._id && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setGroupToDelete(group);
                          setShowDeleteDialog(true);
                        }}
                        className="flex items-center gap-2 w-full p-2 cursor-pointer hover:bg-destructive/10 text-destructive rounded-md"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Delete</span>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      ))}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Group
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {groupToDelete?.name}? This
              action cannot be undone. Make sure there are no projects in this
              group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setGroupToDelete(null);
              }}
              disabled={isDeleting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => handleGroupDelete(groupToDelete)}
              disabled={isDeleting} // Disable during deletion
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Group"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GroupsCardLayout;
