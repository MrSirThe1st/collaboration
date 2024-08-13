import { setAllAdminProjects } from "@/redux/projectSlice";
import { PROJECT_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllAdminProjects = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllAdminProjects = async () => {
      try {
        const res = await axios.get(
          `${PROJECT_API_END_POINT}/getadminprojects`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setAllAdminProjects(res.data.projects));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllAdminProjects();
  }, []);
};

export default useGetAllAdminProjects;
