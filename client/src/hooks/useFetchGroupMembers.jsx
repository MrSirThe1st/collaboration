import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setMembers, setSingleGroup } from "@/redux/groupSlice"; 
import { COMPANY_API_END_POINT } from "@/utils/constant";

const useFetchGroupMembers = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!id) {
        console.log("No group id provided yet");
        return;
      }
      console.log("Fetching group data for id:", id);
      try {
        const response = await axios.get(`${COMPANY_API_END_POINT}/get/${id}`,
          {
            withCredentials: true,
          });
        console.log("API response:", response.data);
        const { group } = response.data;
        if (group) {
          dispatch(setSingleGroup(group)); // Use setSingleGroup here
          if (group.members && group.members.length > 0) {
            console.log("Members from API:", group.members);
            dispatch(setMembers(group.members));
          } else {
            console.log("No members found in the group data");
          }
        }
      } catch (error) {
        console.error("Failed to fetch group data", error);
      }
    };

    fetchGroupData();
  }, [id, dispatch]);
};

export default useFetchGroupMembers;
