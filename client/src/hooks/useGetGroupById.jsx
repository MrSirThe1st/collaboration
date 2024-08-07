import { setSingleGroup } from "@/redux/groupSlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetGroupById = (groupId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleGroup = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${groupId}`, {
          withCredentials: true,
        });
        console.log(res.data.group);
        if (res.data.success) {
          dispatch(setSingleGroup(res.data.group));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleGroup();
  }, [groupId, dispatch]);
};

export default useGetGroupById;
