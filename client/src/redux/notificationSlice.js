import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;

      try {
        const audio = new Audio("/notification-sound.mp3");
        audio
          .play()
          .catch((e) => console.error("Error playing notification sound:", e));
      } catch (error) {
        console.error("Could not play notification sound:", error);
      }
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    clearNotification: (state, action) => {
      const notificationId = action.payload;
      const notificationToDelete = state.notifications.find(
        (n) => n._id === notificationId
      );

      state.notifications = state.notifications.filter(
        (n) => n._id !== notificationId
      );

      if (notificationToDelete && !notificationToDelete.read) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  setLoading,
  setError,
  clearNotification,
  clearAllNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
