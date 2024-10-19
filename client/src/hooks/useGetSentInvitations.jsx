import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAllSentInvitations } from "@/redux/projectSlice";
import { INVITATION_API_END_POINT } from "@/utils/constant";

const useGetSentInvitations = () => {
  const dispatch = useDispatch();
  const { allSentInvitations } = useSelector((store) => store.project);
  useEffect(() => {
    const fetchSentInvitations = async () => {
      try {
        const res = await axios.get(`${INVITATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.data.success) {
          dispatch(setAllSentInvitations(res.data.invitations));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSentInvitations();
  }, [ dispatch]);
};

export default useGetSentInvitations;
