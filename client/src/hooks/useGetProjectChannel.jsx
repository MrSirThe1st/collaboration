// hooks/useGetProjectChannels.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setChannels } from "@/redux/channelSlice";
import { CHANNEL_API_END_POINT } from "@/utils/constant";

const useGetProjectChannels = (projectId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        if (!projectId) return;

        const response = await axios.get(
          `${CHANNEL_API_END_POINT}/get/${projectId}`,
          { withCredentials: true }
        );

        if (response.data.success) {
          dispatch(setChannels(response.data.channels));
        }
      } catch (error) {
        if (error.response?.status === 403) {
          console.error(
            "User does not have permission to access channels:",
            error
          );
          // You can display a user-friendly error message here
          toast.error(
            "You do not have permission to access the channels for this project."
          );
        } else {
          console.error("Error fetching channels:", error);
          // Handle other types of errors
          toast.error("Failed to fetch channels. Please try again later.");
        }
      }
    };

    fetchChannels();
  }, [projectId, dispatch]);
};

export default useGetProjectChannels;
