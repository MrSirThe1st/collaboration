import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProjects } from "@/redux/projectSlice";

const useGetAllProjects = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);
};

export default useGetAllProjects;