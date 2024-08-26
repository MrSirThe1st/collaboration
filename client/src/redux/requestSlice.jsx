import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "request",
  initialState: {
    requesters: null,
  },
  reducers: {
    setAllRequesters: (state, action) => {
      state.requesters = action.payload;
    },
  },
});
export const { setAllRequesters } = requestSlice.actions;
export default requestSlice.reducer;
