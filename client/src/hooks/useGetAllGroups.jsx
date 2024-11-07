import { setGroups } from "@/redux/groupSlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllGroups = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setGroups(res.data.groups));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchGroups();
  }, [dispatch]); // Only depend on dispatch
};

export default useGetAllGroups;
