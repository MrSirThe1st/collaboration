// redux/inboxSlice.js
import { createSlice } from "@reduxjs/toolkit";

const inboxSlice = createSlice({
  name: "inbox",
  initialState: {
    conversations: [],
    currentChat: null,
    messages: [],
    loading: false,
    error: null,
    unreadCounts: {},
    totalUnread: 0,
  },
  reducers: {
    resetInbox: (state) => {
      state.messages = [];
      state.currentChat = null;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    incrementUnreadCount: (state, action) => {
      const conversationId = action.payload;
      state.unreadCounts[conversationId] =
        (state.unreadCounts[conversationId] || 0) + 1;
      state.totalUnread += 1;
    },

    clearUnreadCount: (state, action) => {
      const conversationId = action.payload;
      if (conversationId in state.unreadCounts) {
        state.totalUnread -= state.unreadCounts[conversationId];
        state.unreadCounts[conversationId] = 0;
      }
    },

    setInitialUnreadCounts: (state, action) => {
      const counts = {};
      let total = 0;
      action.payload.forEach((conv) => {
        counts[conv._id] = conv.unreadCount || 0;
        total += conv.unreadCount || 0;
      });
      state.unreadCounts = counts;
      state.totalUnread = total;
    },
  },
});

export const {
  resetInbox,
  setConversations,
  setCurrentChat,
  setMessages,
  addMessage,
  setLoading,
  setError,
  incrementUnreadCount,
  clearUnreadCount,
  setInitialUnreadCounts,
} = inboxSlice.actions;

export const selectTotalUnreadMessages = (state) =>
  Object.values(state.inbox.unreadCounts).reduce(
    (sum, count) => sum + count,
    0
  );

export default inboxSlice.reducer;
