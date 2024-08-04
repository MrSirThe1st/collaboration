import { createSlice } from "@reduxjs/toolkit";

const ProjectSlice = createSlice({
  name: "project",
  initialState: {
    allProjects: [],
    allAdminProjects: [],
    singleProject: null,
    searchProjectByText: "",
    allAppliedProjects: [],
    searchedQuery: "",
  },
  reducers: {
    // actions
    setAllProjects: (state, action) => {
      state.allProjects = action.payload;
    },
    setSingleProject: (state, action) => {
      state.singleProject = action.payload;
    },
    setAllAdminProjects: (state, action) => {
      state.allAdminProjects = action.payload;
    },
    setSearchProjectByText: (state, action) => {
      state.searchProjectByText = action.payload;
    },
    setAllAppliedProjects: (state, action) => {
      state.allAppliedProjects = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
  },
});
export const {
  setAllProjects,
  setSingleProject,
  setAllAdminProjects,
  setSearchProjectByText,
  setAllAppliedProjects,
  setSearchedQuery,
} = ProjectSlice.actions;
export default ProjectSlice.reducer;
