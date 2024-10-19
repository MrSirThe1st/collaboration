import { setGroups } from "@/redux/groupSlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllGroups = () => {
  const dispatch = useDispatch();
  const { searchGroupByText, members, singleGroup, groups } = useSelector(
    (store) => store.group
  );
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        console.log("called");
        if (res.data.success) {
          dispatch(setGroups(res.data.groups));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchGroups();
  }, [dispatch, searchGroupByText, members, singleGroup, groups]);
};

export default useGetAllGroups;
