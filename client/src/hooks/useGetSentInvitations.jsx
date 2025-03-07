import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllSentInvitations } from "@/redux/projectSlice";
import { INVITATION_API_END_POINT } from "@/utils/constant";
import { setLoading } from "@/redux/invitationSlice";

const useGetSentInvitations = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSentInvitations = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${INVITATION_API_END_POINT}/get`, {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.data.success) {
          dispatch(setAllSentInvitations(res.data.invitations));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading(false)); 
      }
    };
    fetchSentInvitations();
  }, [ dispatch]);
};

export default useGetSentInvitations;
