import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; 
import { PROJECT_API_END_POINT } from "@/utils/constant"; 


export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async () => {
    const response = await axios.get(`${PROJECT_API_END_POINT}/get`, {
      withCredentials: true,
    });
    return response.data.projects;
  }
);

const ProjectSlice = createSlice({
  name: "project",
  initialState: {
    allProjects: [],
    allAdminProjects: [],
    singleProject: null,
    searchProjectByText: "",
    allRequestedProjects: [],
    searchedQuery: "",
    allSentInvitations: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
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
    setAllSentInvitations: (state, action) => {
      state.allSentInvitations = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    updateProjectMember: (state, action) => {
      const { projectId, memberId, role } = action.payload;
      const project = state.allAdminProjects.find((p) => p._id === projectId);
      if (project) {
        const member = project.members.find((m) => m.user === memberId);
        if (member) {
          member.roles.push(role);
        } else {
          project.members.push({ user: memberId, roles: [role] });
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.allProjects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  setAllProjects,
  setSingleProject,
  setAllAdminProjects,
  setSearchProjectByText,
  setAllRequestedProjects,
  setAllSentInvitations,
  setSearchedQuery,
  updateProjectMember,
  setLoading,
} = ProjectSlice.actions;

export default ProjectSlice.reducer;
