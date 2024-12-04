// projectMessagesSlice.js
import { createSlice } from "@reduxjs/toolkit";

const projectMessagesSlice = createSlice({
  name: "projectMessages",
  initialState: {
    announcements: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAnnouncements: (state, action) => {
      state.announcements = action.payload;
    },
    addAnnouncement: (state, action) => {
      state.announcements = [action.payload, ...state.announcements];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAnnouncements,
  addAnnouncement,
  setLoading,
  setError,
  clearError,
} = projectMessagesSlice.actions;

export default projectMessagesSlice.reducer;
