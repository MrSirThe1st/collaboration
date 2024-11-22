import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import requestSlice from "./requestSlice";
import groupSlice from "./groupSlice";
import invitationSlice from "./invitationSlice";
import projectSlice from "./projectSlice";
import channelSlice from "./channelSlice";
import taskMilestoneSlice from "./taskMilestoneSlice";
import messageSlice from "./messageSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["project", "group", "messages"],
  // blacklist: ["invitation"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  group: groupSlice,
  request: requestSlice,
  invitation: invitationSlice,
  project: projectSlice,
  channel: channelSlice,
  taskMilestone: taskMilestoneSlice,
  messages: messageSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export default store;
