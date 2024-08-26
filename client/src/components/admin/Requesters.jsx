import React, { useEffect } from "react";
import Navbar from "../shared/Navbar";
import RequestersTable from "./RequestersTable";
import axios from "axios";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllRequesters } from "@/redux/requestSlice";

const Requesters = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { requesters } = useSelector((store) => store.request);

  useEffect(() => {
    const fetchAllRequesters = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/${params.id}/requesters`,
          { withCredentials: true }
        );
        dispatch(setAllRequesters(res.data.project));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllRequesters();
  }, []);
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <h1 className="font-bold text-xl my-5">
          {requesters?.requests?.length} Requests
        </h1>
        <RequestersTable />
      </div>
    </div>
  );
};

export default Requesters;
