import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGroups, setLoading } from "@/redux/groupSlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";

const useGetAllGroups = () => {
  const dispatch = useDispatch();
  const { groups } = useSelector((state) => state.group);

  useEffect(() => {
    if (groups.length === 0) {
      const fetchGroups = async () => {
        dispatch(setLoading(true));
        try {
          const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
            withCredentials: true,
          });
          if (res.data.success) {
            dispatch(setGroups(res.data.groups));
          }
        } catch (error) {
          console.log(error);
        } finally {
          dispatch(setLoading(false));
        }
      };
      fetchGroups();
    }
  }, [dispatch, groups.length]); 
};

export default useGetAllGroups;
