// @/components/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import mentorsReducer from "./slices/mentorSlice";
import chatReducer from "./slices/chatSlice";
import loadingReducer from "./slices/loadingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mentors: mentorsReducer,
    chat: chatReducer,
    loading: loadingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;