import { createSlice } from "@reduxjs/toolkit";

const invitaionSlice = createSlice({
  name: "invitation",
  initialState: {
    senders: null,
  },
  reducers: {
    setAllSenders: (state, action) => {
      state.senders = action.payload;
    },
  },
});
export const { setAllSenders } = invitaionSlice.actions;
export default invitaionSlice.reducer;
