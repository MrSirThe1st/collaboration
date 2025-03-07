import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllSenders } from "@/redux/invitationSlice";
import { INVITATION_API_END_POINT } from "@/utils/constant";
import { setLoading } from "@/redux/invitationSlice";

const useGetReceivedInvitations = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReceivedInvitations = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${INVITATION_API_END_POINT}/received`, {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.data.success) {
          dispatch(setAllSenders(res.data.invitations));
        }
      } catch (error) {
        console.error("Error fetching received invitations:", error);
      } finally {
        dispatch(setLoading(false)); 
      }
    };
    fetchReceivedInvitations();
  }, [dispatch]);
};

export default useGetReceivedInvitations;
