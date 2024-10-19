import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setAllSenders } from "@/redux/invitationSlice";
import { INVITATION_API_END_POINT } from "@/utils/constant";

const useGetReceivedInvitations = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchReceivedInvitations = async () => {
      try {
        const res = await axios.get(`${INVITATION_API_END_POINT}/received`, {
          withCredentials: true,
        });
        console.log(res.data);
        if (res.data.success) {
          dispatch(setAllSenders(res.data.invitations));
        }
      } catch (error) {
        console.error("Error fetching received invitations:", error);
      }
    };
    fetchReceivedInvitations();
  }, [dispatch]);
};

export default useGetReceivedInvitations;
