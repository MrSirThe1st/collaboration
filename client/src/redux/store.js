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
import conversationSlice from "./conversationSlice";
import projectSlice from "./projectSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["project"],
  blacklist: ["group"],
  // blacklist: ["invitation"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  group: groupSlice,
  request: requestSlice,
  invitation: invitationSlice,
  conversation: conversationSlice,
  project: projectSlice,
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
