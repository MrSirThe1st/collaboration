import { createSlice } from "@reduxjs/toolkit";

const invitationSlice = createSlice({
  name: "invitation",
  initialState: {
    senders: null,
    unreadInvitations: [],
    lastCheckedTimestamp: null,
  },
  reducers: {
    setAllSenders: (state, action) => {
      state.senders = action.payload;

      // Update unread invitations list
      if (action.payload) {
        // If we have a last checked timestamp, only count newer invitations as unread
        if (state.lastCheckedTimestamp) {
          action.payload.forEach((invitation) => {
            const invitationDate = new Date(invitation.createdAt).getTime();
            if (
              !state.unreadInvitations.includes(invitation._id) &&
              invitation.status === "pending" &&
              invitationDate > state.lastCheckedTimestamp
            ) {
              state.unreadInvitations.push(invitation._id);
            }
          });
        } else {
          // First load - consider all pending invitations as unread
          action.payload.forEach((invitation) => {
            if (
              !state.unreadInvitations.includes(invitation._id) &&
              invitation.status === "pending"
            ) {
              state.unreadInvitations.push(invitation._id);
            }
          });
        }
      }
    },
    markInvitationAsRead: (state, action) => {
      state.unreadInvitations = state.unreadInvitations.filter(
        (id) => id !== action.payload
      );
    },
    markAllInvitationsAsRead: (state) => {
      state.unreadInvitations = [];
      state.lastCheckedTimestamp = Date.now();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addNewInvitation: (state, action) => {
      const invitation = action.payload;
      if (!state.unreadInvitations.includes(invitation._id)) {
        state.unreadInvitations.push(invitation._id);
      }

      // Update the senders array if it exists
      if (state.senders) {
        // Check if this invitation already exists
        const existingIndex = state.senders.findIndex(
          (inv) => inv._id === invitation._id
        );

        if (existingIndex >= 0) {
          state.senders[existingIndex] = invitation;
        } else {
          state.senders.unshift(invitation);
        }
      }
    },
  },
});

// Selector to get unread invitations count
export const getUnreadInvitationsCount = (state) => {
  return state?.invitation?.unreadInvitations?.length || 0;
};

export const {
  setAllSenders,
  markInvitationAsRead,
  markAllInvitationsAsRead,
  setLoading,
  addNewInvitation,
} = invitationSlice.actions;

export default invitationSlice.reducer;
