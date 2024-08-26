import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  APPLICATION_API_END_POINT,
  PROJECT_API_END_POINT,
} from "@/utils/constant";
import { setSingleProject } from "@/redux/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const ProjectDescription = () => {
  const { singleProject } = useSelector((store) => store.project);
  const { user } = useSelector((store) => store.auth);
  const isInitiallyRequested =
    singleProject?.requests?.some(
      (request) => request.requester === user?._id
    ) || false;
  const [isRequested, setIsRequested] = useState(isInitiallyRequested);

  const params = useParams();
  const projectId = params.id;
  const dispatch = useDispatch();

  const requestProjectHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/request/${projectId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsRequested(true); // Update the local state
        const updatedSingleProject = {
          ...singleProject,
          requests: [...singleProject.requests, { requester: user?._id }],
        };
        dispatch(setSingleProject(updatedSingleProject)); // helps us to real time UI update
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleProject = async () => {
      try {
        const res = await axios.get(
          `${PROJECT_API_END_POINT}/get/${projectId}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          dispatch(setSingleProject(res.data.project));
          setIsRequested(
            res.data.project.requests.some(
              (request) => request.requester === user?._id
            )
          ); // Ensure the state is in sync with fetched data
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleProject();
  }, [projectId, dispatch, user?._id]);

  return (
    <div className="max-w-7xl mx-auto my-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">{singleProject?.title}</h1>
          <div className="flex items-center gap-2 mt-4">
            <Badge className={"text-blue-700 font-bold"} variant="ghost">
              {singleProject?.description} Positions
            </Badge>
            <Badge className={"text-[#F83002] font-bold"} variant="ghost">
              {singleProject?.location}
            </Badge>
            <Badge className={"text-[#7209b7] font-bold"} variant="ghost">
              {singleProject?.requirements}LPA
            </Badge>
          </div>
        </div>
        <Button
          onClick={isRequested ? null : requestProjectHandler}
          disabled={isRequested}
          className={`rounded-lg ${
            isRequested
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#7209b7] hover:bg-[#5f32ad]"
          }`}
        >
          {isRequested ? "Already Requested" : "Request Now"}
        </Button>
      </div>
      <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
        Project Description
      </h1>
      <div className="my-4">
        <h1 className="font-bold my-1">
          Role:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleProject?.title}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Location:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleProject?.location}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Description:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleProject?.description}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Experience:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleProject?.experience} yrs
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Salary:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleProject?.salary}LPA
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Total Requesters:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleProject?.requests?.length}
          </span>
        </h1>
        <h1 className="font-bold my-1">
          Posted Date:{" "}
          <span className="pl-4 font-normal text-gray-800">
            {singleProject?.createdAt.split("T")[0]}
          </span>
        </h1>
      </div>
    </div>
  );
};

export default ProjectDescription;
