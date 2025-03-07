import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "group",
  initialState: {
    singleGroup: null,
    groups: [],
    members: [],
    searchGroupByText: "",
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
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
export const {
  setSingleGroup,
  setGroups,
  setMembers,
  setSearchGroupByText,
  setLoading,
} = groupSlice.actions;
export default groupSlice.reducer;
