import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    currentThread: null,
    pinnedMessages: [],
    loading: false,
    error: null,
    unreadCount: 0,
    activeThreadId: null,
    drafts: {}, 
    editingMessageId: null,
    fileUploads: [], 
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(
        (msg) => msg._id === action.payload._id
      );
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    deleteMessage: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      );
    },
    setCurrentThread: (state, action) => {
      state.currentThread = action.payload;
    },
    setPinnedMessages: (state, action) => {
      state.pinnedMessages = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    setActiveThreadId: (state, action) => {
      state.activeThreadId = action.payload;
    },
    // Save draft message for a channel
    saveDraft: (state, action) => {
      const { channelId, content } = action.payload;
      state.drafts[channelId] = content;
    },
    // Clear draft for a channel
    clearDraft: (state, action) => {
      delete state.drafts[action.payload];
    },
    setEditingMessageId: (state, action) => {
      state.editingMessageId = action.payload;
    },
    // Track file upload progress
    addFileUpload: (state, action) => {
      state.fileUploads.push(action.payload);
    },
    updateFileUpload: (state, action) => {
      const { id, progress } = action.payload;
      const upload = state.fileUploads.find((u) => u.id === id);
      if (upload) {
        upload.progress = progress;
      }
    },
    removeFileUpload: (state, action) => {
      state.fileUploads = state.fileUploads.filter(
        (u) => u.id !== action.payload
      );
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  deleteMessage,
  setCurrentThread,
  setPinnedMessages,
  setLoading,
  setError,
  incrementUnreadCount,
  resetUnreadCount,
  setActiveThreadId,
  saveDraft,
  clearDraft,
  setEditingMessageId,
  addFileUpload,
  updateFileUpload,
  removeFileUpload,
} = messageSlice.actions;

export default messageSlice.reducer;
