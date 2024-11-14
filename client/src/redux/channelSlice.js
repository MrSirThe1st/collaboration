import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channels: [], 
    selectedChannel: null,
    searchChannelByText: "",
  },
  reducers: {
    setChannels: (state, action) => {
      state.channels = action.payload;
    },
    setSelectedChannel: (state, action) => {
      state.selectedChannel = action.payload;
    },
    addChannel: (state, action) => {
      const exists = state.channels.some(
        (channel) => channel._id === action.payload._id
      );
      if (!exists) {
        state.channels = [...state.channels, action.payload];
      }
    },
    removeChannel: (state, action) => {
      state.channels = state.channels.filter(
        (channel) => channel._id !== action.payload
      );
    },
  },
});

export const { setChannels, setSelectedChannel, addChannel, removeChannel } =
  channelSlice.actions;

export default channelSlice.reducer;
