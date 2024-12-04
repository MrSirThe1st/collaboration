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
    unreadCounts: {}, // { userId: count }
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
    updateUnreadCount: (state, action) => {
      const { userId, count } = action.payload;
      state.unreadCounts[userId] = count;
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
  updateUnreadCount,
} = inboxSlice.actions;

export default inboxSlice.reducer;
