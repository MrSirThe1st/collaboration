import { createSlice } from "@reduxjs/toolkit";

const ProjectSlice = createSlice({
  name: "project",
  initialState: {
    allProjects: [],
    allAdminProjects: [],
    singleProject: null,
    searchProjectByText: "",
    allRequestedProjects: [],
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
    setAllRequestedProjects: (state, action) => {
      state.allRequestedProjects = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    updateProjectMember: (state, action) => {
      const { projectId, memberId, role } = action.payload;
      const projectIndex = state.allAdminProjects.findIndex(
        (p) => p._id === projectId
      );
      if (projectIndex !== -1) {
        const project = state.allAdminProjects[projectIndex];
        const memberIndex = project.members.findIndex(
          (m) => m.user === memberId
        );
        if (memberIndex !== -1) {
          project.members[memberIndex].roles.push(role);
        } else {
          project.members.push({ user: memberId, roles: [role] });
        }
      }
    },
  },
});
export const {
  setAllProjects,
  setSingleProject,
  setAllAdminProjects,
  setSearchProjectByText,
  setAllRequestedProjects,
  setSearchedQuery,
  updateProjectMember
} = ProjectSlice.actions;
export default ProjectSlice.reducer;
