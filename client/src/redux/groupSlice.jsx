import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "group",
  initialState: {
    singleGroup: null,
    groups: [],
    searchGroupByText: "",
  },
  reducers: {
    // actions
    setSingleGroup: (state, action) => {
      state.singleGroup = action.payload;
    },
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setSearchGroupByText: (state, action) => {
      state.searchGroupByText = action.payload;
    },
  },
});
export const { setSingleGroup, setGroups, setSearchGroupByText } =
  groupSlice.actions;
export default groupSlice.reducer;
