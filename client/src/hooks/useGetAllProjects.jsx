import { setAllProjects } from "@/redux/projectSlice";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllProjects = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.project);
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const res = await axios.get(
          `${PROJECT_API_END_POINT}/get?keyword=${searchedQuery}`,
          { withCredentials: true }
        );
        console.log(res.data); // Add this line to debug
        if (res.data.success) {
          dispatch(setAllProjects(res.data.projects));
        }

      } catch (error) {
        console.log(error);
      }
    };
    fetchAllProjects();
  }, []);
};

export default useGetAllProjects;
