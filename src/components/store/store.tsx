// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/components/features/auth/authSlice";
import chatReducer from "@/components/store/slices/chatSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;