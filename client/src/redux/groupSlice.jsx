import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "group",
  initialState: {
    singleGroup: null,
    groups: [],
    members: [],
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
    setMembers: (state, action) => {
      state.members = action.payload;
    },
    setSearchGroupByText: (state, action) => {
      state.searchGroupByText = action.payload;
    },
  },
});
export const { setSingleGroup, setGroups, setMembers, setSearchGroupByText } =
  groupSlice.actions;
export default groupSlice.reducer;
